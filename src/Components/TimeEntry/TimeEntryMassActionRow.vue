<script setup>
import MainContainer from '@/Components/src/MainContainer.vue';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/20/solid';
import TimeEntryMassUpdateModal from '@/Components/TimeEntry/TimeEntryMassUpdateModal.vue';
import { ref } from 'vue';
import { twMerge } from 'tailwind-merge';
import Checkbox from '@/Components/src/Input/Checkbox.vue';
import InputLabel from '@/Components/src/Input/InputLabel.vue';

const props = defineProps({
	selectedTimeEntries: Array,
	deleteSelected: Function,
	class: {
		type: String,
		required: false,
	},
	allSelected: Boolean,
	projects: Array,
	tasks: Array,
	tags: Array,
	updateTimeEntries: Function,
	canCreateProject: Boolean,
});

const emit = defineEmits(['submit', 'selectAll', 'unselectAll']);

const showMassUpdateModal = ref(false);
</script>

<template>
	<TimeEntryMassUpdateModal
		v-model:show="showMassUpdateModal"
		:projects
		:tasks
		:tags
		:update-time-entries
		:can-create-project
		:time-entries="selectedTimeEntries"
		@submit="emit('submit')"
	></TimeEntryMassUpdateModal>
	<MainContainer
		:class="
			twMerge(
				props.class,
				'text-sm py-1.5 font-medium border-t border-b bg-secondary border-border-secondary flex items-center space-x-3'
			)
		"
	>
		<Checkbox
			id="selectAll"
			:checked="allSelected"
			@update:checked="allSelected ? emit('unselectAll') : emit('selectAll')"
		>
		</Checkbox>
		<InputLabel v-if="selectedTimeEntries.length > 0" for="selectAll" class="select-none text-text-secondary">
			{{ selectedTimeEntries.length }} sélectionnés
		</InputLabel>
		<InputLabel v-else for="selectAll" class="text-text-secondary select-none">Sélectionner tous</InputLabel>
		<button
			v-if="selectedTimeEntries.length"
			class="text-text-tertiary flex space-x-1 items-center hover:text-text-secondary transition focus-visible:ring-2 outline-0 focus-visible:text-text-primary focus-visible:ring-ring rounded h-full px-2"
			@click="showMassUpdateModal = true"
		>
			<PencilSquareIcon class="w-4"></PencilSquareIcon>
			<span>Modifier</span>
		</button>
		<button
			v-if="selectedTimeEntries.length"
			class="text-red-400 h-full px-2 space-x-1 items-center flex hover:text-red-500 transition focus-visible:ring-2 outline-0 focus-visible:text-red-500 focus-visible:ring-ring rounded"
			@click="deleteSelected"
		>
			<TrashIcon class="w-3.5"></TrashIcon>
			<span>Supprimer</span>
		</button>
	</MainContainer>
</template>

<style scoped></style>
