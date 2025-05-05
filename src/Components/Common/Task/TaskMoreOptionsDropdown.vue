<script setup>
import { TrashIcon, PencilSquareIcon, CheckCircleIcon } from '@heroicons/vue/20/solid';
import MoreOptionsDropdown from '@/Components/src/MoreOptionsDropdown.vue';

const emit = defineEmits(['delete', 'edit', 'done']);

const props = defineProps({
	task: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<MoreOptionsDropdown :label="'Actions for Task ' + props.task.name">
		<div class="min-w-[150px]">
			<button
				:aria-label="'Edit Task ' + props.task.name"
				data-testid="task_edit"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('edit')"
			>
				<PencilSquareIcon class="w-5 text-icon-active" />
				<span>Edit</span>
			</button>
			<button
				:aria-label="'Mark Task ' + props.task.name + ' as done'"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('done')"
			>
				<CheckCircleIcon class="w-5 text-icon-active" />
				<span v-if="props.task.is_done">Mark as active</span>
				<span v-else>Mark as done</span>
			</button>
			<button
				:aria-label="'Delete Task ' + props.task.name"
				data-testid="task_delete"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('delete')"
			>
				<TrashIcon class="w-5 text-icon-active" />
				<span>Delete</span>
			</button>
		</div>
	</MoreOptionsDropdown>
</template>

<style scoped></style>
