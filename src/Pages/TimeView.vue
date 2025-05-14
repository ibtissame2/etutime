<script setup>
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import AppLayout from '@/Layouts/AppLayout.vue';
import TimeTracker from '@/Components/TimeTracker/TimeTracker.vue';
import MainContainer from '@/Components/src/MainContainer.vue';
import { useTimeEntriesStore } from '@/utils/useTimeEntries';
import { useElementVisibility } from '@vueuse/core';
import { ClockIcon } from '@heroicons/vue/20/solid';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import { PlusIcon } from '@heroicons/vue/16/solid';
import LoadingSpinner from '@/Components/src/LoadingSpinner.vue';
import { useMinuteursStore } from '@/store/minuteurs';
import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
import { useTachesStore } from '@/store/taches';
import TimeEntryGroupedTable from '@/Components/TimeEntry/TimeEntryGroupedTable.vue';
import TimeEntryCreateModal from '@/Components/Forms/TimeEntryCreateModal.vue';
import TimeEntryMassActionRow from '@/Components/TimeEntry/TimeEntryMassActionRow.vue';

const { fetchMoreTimeEntries, updateTimeEntry, fetchTimeEntries, createTimeEntry } = useTimeEntriesStore();
const { setActiveState, fetchCurrentTimeEntry } = useMinuteursStore();
const { timeEntries, allTimeEntriesLoaded } = storeToRefs(useTimeEntriesStore());
const { modules } = storeToRefs(useModulesStore());
const { chapitres } = storeToRefs(useChapitresStore());
const { taches } = storeToRefs(useTachesStore());
const { currentTimer } = storeToRefs(useMinuteursStore());

const loading = ref(false);
const loadMoreContainer = ref(null);
const isLoadMoreVisible = useElementVisibility(loadMoreContainer);
const showManualTimeEntryModal = ref(false);
const selectedTimeEntries = ref([]);

async function updateTimeEntries(ids, changes) {
	await useTimeEntriesStore().updateTimeEntries(ids, changes);
	fetchTimeEntries();
}

async function createTimer(timer) {
	if (currentTimer.value?.id) await setActiveState(false, currentTimer.value);
	// // Ibtissame: set the new entry as the current one
	// await createMinuteur(timeEntry);
	// fetchTimeEntries();
	// fetchCurrentTimeEntry();
}

function deleteTimeEntries(timeEntries) {
	useTimeEntriesStore().deleteTimeEntries(timeEntries);
	fetchTimeEntries();
}

async function clearSelectionAndState() {
	selectedTimeEntries.value = [];
	await fetchTimeEntries();
}

function deleteSelected() {
	deleteTimeEntries(selectedTimeEntries.value);
	selectedTimeEntries.value = [];
}

watch(isLoadMoreVisible, async (isVisible) => {
	if (isVisible && timeEntries.value.length > 0 && !allTimeEntriesLoaded.value) {
		loading.value = true;
		await fetchMoreTimeEntries();
	}
});

onMounted(async () => {
	await fetchTimeEntries();
});
</script>

<template>
	<TimeEntryCreateModal v-model:show="showManualTimeEntryModal"></TimeEntryCreateModal>
	<AppLayout title="Suivi du temps" data-testid="time_view">
		<MainContainer class="pt-5 lg:pt-8 pb-4 lg:pb-6">
			<div
				class="lg:flex items-end lg:divide-x divide-default-background-separator divide-y lg:divide-y-0 space-y-2 lg:space-y-0 lg:space-x-2"
			>
				<div class="flex-1">
					<TimeTracker></TimeTracker>
				</div>
				<div class="pb-2 pt-2 lg:pt-0 lg:pl-4 flex justify-center">
					<SecondaryButton
						class="w-full text-center flex justify-center"
						:icon="PlusIcon"
						@click="showManualTimeEntryModal = true"
						>Saisie manuelle du minuteur
					</SecondaryButton>
				</div>
			</div>
		</MainContainer>
		<TimeEntryMassActionRow
			:selected-time-entries="selectedTimeEntries"
			:can-create-project="true"
			:all-selected="selectedTimeEntries.length === timeEntries.length"
			:delete-selected="deleteSelected"
			:projects="modules"
			:tasks="chapitres"
			:tags="taches"
			:update-time-entries="
				(args) =>
					updateTimeEntries(
						selectedTimeEntries.map((timeEntry) => timeEntry.id),
						args
					)
			"
			@submit="clearSelectionAndState"
			@select-all="selectedTimeEntries = [...timeEntries]"
			@unselect-all="selectedTimeEntries = []"
		></TimeEntryMassActionRow>
		<TimeEntryGroupedTable
			v-model:selected="selectedTimeEntries"
			:can-create-project="true"
			:update-time-entry="updateTimeEntry"
			:update-time-entries="updateTimeEntries"
			:delete-time-entries="deleteTimeEntries"
			:create-time-entry="createTimer"
			:projects="modules"
			:tasks="chapitres"
			:time-entries="timeEntries"
			:tags="taches"
		></TimeEntryGroupedTable>
		<div v-if="timeEntries.length === 0" class="text-center pt-12">
			<ClockIcon class="w-8 text-icon-default inline pb-2"></ClockIcon>
			<h3 class="text-text-primary font-semibold">Aucune minuteur trouvée</h3>
			<p class="pb-5">Créez votre première entrée maintenant !</p>
		</div>
		<div ref="loadMoreContainer">
			<div
				v-if="loading && !allTimeEntriesLoaded"
				class="flex justify-center items-center py-5 text-text-primary font-medium"
			>
				<LoadingSpinner></LoadingSpinner>
				<span> Loading more time entries... </span>
			</div>
			<div v-else-if="allTimeEntriesLoaded" class="flex justify-center items-center py-5 text-muted font-medium">
				All time entries are loaded!
			</div>
		</div>
	</AppLayout>
</template>
