<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import TimeTracker from '@/Components/TimeTracker.vue';
import { onMounted, ref, watch } from 'vue';
import MainContainer from '@/packages/ui/src/MainContainer.vue';
import { useTimeEntriesStore } from '@/utils/useTimeEntries';
import { storeToRefs } from 'pinia';
import { useElementVisibility } from '@vueuse/core';
import { ClockIcon } from '@heroicons/vue/20/solid';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import { PlusIcon } from '@heroicons/vue/16/solid';
import LoadingSpinner from '@/packages/ui/src/LoadingSpinner.vue';
import { useCurrentTimeEntryStore } from '@/utils/useCurrentTimeEntry';
import { useTasksStore } from '@/utils/useTasks';
import { useModulesStore } from '@/store/modules';
import TimeEntryGroupedTable from '@/packages/ui/src/TimeEntry/TimeEntryGroupedTable.vue';
import { useTagsStore } from '@/utils/useTags';
import { useClientsStore } from '@/utils/useClients';
import TimeEntryCreateModal from '@/packages/ui/src/TimeEntry/TimeEntryCreateModal.vue';
import TimeEntryMassActionRow from '@/packages/ui/src/TimeEntry/TimeEntryMassActionRow.vue';
import { canCreateModule } from '@/utils/permissions';

const timeEntriesStore = useTimeEntriesStore();
const { timeEntries, allTimeEntriesLoaded } = storeToRefs(timeEntriesStore);
const { updateTimeEntry, fetchTimeEntries, createTimeEntry } = useTimeEntriesStore();

async function updateTimeEntries(ids, changes) {
	await useTimeEntriesStore().updateTimeEntries(ids, changes);
	fetchTimeEntries();
}

const loading = ref(false);
const loadMoreContainer = ref(null);
const isLoadMoreVisible = useElementVisibility(loadMoreContainer);
const currentTimeEntryStore = useCurrentTimeEntryStore();
const { currentTimeEntry } = storeToRefs(currentTimeEntryStore);
const { setActiveState } = currentTimeEntryStore;
const { tags } = storeToRefs(useTagsStore());

async function startTimeEntry(timeEntry) {
	if (currentTimeEntry.value.id) {
		await setActiveState(false);
	}
	await createTimeEntry(timeEntry);
	fetchTimeEntries();
	useCurrentTimeEntryStore().fetchCurrentTimeEntry();
}

function deleteTimeEntries(timeEntries) {
	useTimeEntriesStore().deleteTimeEntries(timeEntries);
	fetchTimeEntries();
}

watch(isLoadMoreVisible, async (isVisible) => {
	if (isVisible && timeEntries.value.length > 0 && !allTimeEntriesLoaded.value) {
		loading.value = true;
		await timeEntriesStore.fetchMoreTimeEntries();
	}
});

onMounted(async () => {
	await timeEntriesStore.fetchTimeEntries();
});

const showManualTimeEntryModal = ref(false);

const { modules } = storeToRefs(useModulesStore());
const taskStore = useTasksStore();
const { tasks } = storeToRefs(taskStore);
const clientStore = useClientsStore();
const { clients } = storeToRefs(clientStore);

async function createTag(name) {
	return await useTagsStore().createTag(name);
}

async function createModule(project) {
	return await useModulesStore().createModule(project);
}

async function createClient(body) {
	return await useClientsStore().createClient(body);
}

const selectedTimeEntries = ref([]);

async function clearSelectionAndState() {
	selectedTimeEntries.value = [];
	await fetchTimeEntries();
}

function deleteSelected() {
	deleteTimeEntries(selectedTimeEntries.value);
	selectedTimeEntries.value = [];
}
</script>

<template>
	<TimeEntryCreateModal
		v-model:show="showManualTimeEntryModal"
		:enable-estimated-time="true"
		:create-client="createClient"
		:create-tag="createTag"
		:create-time-entry="createTimeEntry"
		:projects="modules"
		:tasks="tasks"
		:tags="tags"
		:clients="clients"
	></TimeEntryCreateModal>
	<AppLayout title="Dashboard" data-testid="time_view">
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
						>Manual time entry
					</SecondaryButton>
				</div>
			</div>
		</MainContainer>
		<TimeEntryMassActionRow
			:selected-time-entries="selectedTimeEntries"
			:enable-estimated-time="true"
			:can-create-project="canCreateModule()"
			:all-selected="selectedTimeEntries.length === timeEntries.length"
			:delete-selected="deleteSelected"
			:projects="modules"
			:tasks="tasks"
			:tags="tags"
			:currency="'MAD'"
			:clients="clients"
			:update-time-entries="
				(args) =>
					updateTimeEntries(
						selectedTimeEntries.map((timeEntry) => timeEntry.id),
						args
					)
			"
			:create-client="createClient"
			:create-tag="createTag"
			@submit="clearSelectionAndState"
			@select-all="selectedTimeEntries = [...timeEntries]"
			@unselect-all="selectedTimeEntries = []"
		></TimeEntryMassActionRow>
		<TimeEntryGroupedTable
			v-model:selected="selectedTimeEntries"
			:enable-estimated-time="true"
			:can-create-project="canCreateModule()"
			:clients="clients"
			:create-client="createClient"
			:update-time-entry="updateTimeEntry"
			:update-time-entries="updateTimeEntries"
			:delete-time-entries="deleteTimeEntries"
			:create-time-entry="startTimeEntry"
			:create-tag="createTag"
			:projects="modules"
			:tasks="tasks"
			:currency="'MAD'"
			:time-entries="timeEntries"
			:tags="tags"
		></TimeEntryGroupedTable>
		<div v-if="timeEntries.length === 0" class="text-center pt-12">
			<ClockIcon class="w-8 text-icon-default inline pb-2"></ClockIcon>
			<h3 class="text-text-primary font-semibold">No time entries found</h3>
			<p class="pb-5">Create your first time entry now!</p>
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
