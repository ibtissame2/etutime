<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMinuteursStore } from '@/store/minuteurs';
import { PlusIcon } from '@heroicons/vue/16/solid';
import { TrashIcon, ClockIcon } from '@heroicons/vue/20/solid';
import AppLayout from '@/Layouts/AppLayout.vue';
import MainContainer from '@/Components/src/MainContainer.vue';
import LoadingSpinner from '@/Components/src/LoadingSpinner.vue';
import Checkbox from '@/Components/src/Input/Checkbox.vue';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import InputLabel from '@/Components/src/Input/InputLabel.vue';
import TimeTracker from '@/Components/TimeTracker/TimeTracker.vue';
import TimeEntryGroupedTable from '@/Components/TimeEntry/TimeEntryGroupedTable.vue';
import TimeEntryCreateModal from '@/Components/Forms/TimeEntryCreateModal.vue';

const { minuteurs } = storeToRefs(useMinuteursStore());
const { deleteMinuteurs } = useMinuteursStore();

const loading = ref(false);
const showCreateModal = ref(false);
const selectedMinuteurs = ref([]);

function deleteSelected() {
	deleteMinuteurs(selectedMinuteurs.value, () => (selectedMinuteurs.value = []));
}
</script>

<template>
	<TimeEntryCreateModal v-model:show="showCreateModal"></TimeEntryCreateModal>
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
						@click="showCreateModal = true"
						>Saisie manuelle du minuteur
					</SecondaryButton>
				</div>
			</div>
		</MainContainer>
		<MainContainer
			class="text-sm py-1.5 font-medium border-t border-b bg-secondary border-border-secondary flex items-center space-x-3"
		>
			<Checkbox
				id="selectAll"
				:checked="!!selectedMinuteurs.length && selectedMinuteurs.length === minuteurs.length"
				@update:checked="(checked) => (selectedMinuteurs = checked ? [...minuteurs] : [])"
			/>
			<InputLabel v-if="selectedMinuteurs.length > 0" for="selectAll" class="select-none text-text-secondary">
				{{ selectedMinuteurs.length }} sélectionnés
			</InputLabel>
			<InputLabel v-else for="selectAll" class="text-text-secondary select-none">Sélectionner tous</InputLabel>

			<button
				v-if="selectedMinuteurs.length"
				class="text-red-400 h-full px-2 space-x-1 items-center flex hover:text-red-500 transition focus-visible:ring-2 outline-0 focus-visible:text-red-500 focus-visible:ring-ring rounded"
				@click="deleteSelected"
			>
				<TrashIcon class="w-3.5"></TrashIcon>
				<span>Supprimer</span>
			</button>
		</MainContainer>
		<TimeEntryGroupedTable v-model="selectedMinuteurs"></TimeEntryGroupedTable>
		<div v-if="minuteurs.length === 0" class="text-center pt-12">
			<ClockIcon class="w-8 text-icon-default inline pb-2"></ClockIcon>
			<h3 class="text-text-primary font-semibold">Aucune minuteur trouvée</h3>
			<p class="pb-5">Créez votre première minuteur maintenant !</p>
		</div>
		<div>
			<div v-if="loading" class="flex justify-center items-center py-5 text-text-primary font-medium">
				<LoadingSpinner></LoadingSpinner>
				<span>Chargement des minuteurs...</span>
			</div>
		</div>
	</AppLayout>
</template>
