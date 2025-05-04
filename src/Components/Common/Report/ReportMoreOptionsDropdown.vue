<script setup>
import { TrashIcon, PencilSquareIcon } from '@heroicons/vue/20/solid';
import MoreOptionsDropdown from '@/packages/ui/src/MoreOptionsDropdown.vue';

const emit = defineEmits(['delete', 'edit', 'archive']);

const props = defineProps({
	report: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<MoreOptionsDropdown :label="'Actions for Project ' + props.report.name">
		<div class="min-w-[150px]">
			<button
				:aria-label="'Edit Report ' + props.report.name"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click.prevent="emit('edit')"
			>
				<PencilSquareIcon class="w-5 text-icon-active"></PencilSquareIcon>
				<span>Edit</span>
			</button>
			<button
				:aria-label="'Delete Report ' + props.report.name"
				class="border-b border-card-background-separator flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click.prevent="emit('delete')"
			>
				<TrashIcon class="w-5 text-icon-active"></TrashIcon>
				<span>Delete</span>
			</button>
		</div>
	</MoreOptionsDropdown>
</template>

<style scoped></style>
