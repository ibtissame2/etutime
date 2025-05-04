<script setup>
import { ArchiveBoxIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/20/solid';
import MoreOptionsDropdown from '@/packages/ui/src/MoreOptionsDropdown.vue';

const emit = defineEmits(['delete', 'edit', 'archive']);
const props = defineProps({
	client: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<MoreOptionsDropdown :label="'Actions for Client ' + props.client.name">
		<div class="min-w-[150px]">
			<button
				:aria-label="'Edit Client ' + props.client.name"
				data-testid="client_edit"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('edit')"
			>
				<PencilSquareIcon class="w-5 text-icon-active"></PencilSquareIcon>
				<span>Edit</span>
			</button>
			<button
				:aria-label="'Archive Client ' + props.client.name"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click.prevent="emit('archive')"
			>
				<ArchiveBoxIcon class="w-5 text-icon-active"></ArchiveBoxIcon>
				<span>{{ client.is_archived ? 'Unarchive' : 'Archive' }}</span>
			</button>
			<button
				:aria-label="'Delete Client ' + props.client.name"
				data-testid="client_delete"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('delete')"
			>
				<TrashIcon class="w-5 text-icon-active"></TrashIcon>
				<span>Delete</span>
			</button>
		</div>
	</MoreOptionsDropdown>
</template>

<style scoped></style>
