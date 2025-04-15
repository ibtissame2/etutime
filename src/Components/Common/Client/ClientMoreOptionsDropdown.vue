<script>
import { ArchiveBoxIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/20/solid';
import MoreOptionsDropdown from '@/packages/ui/src/MoreOptionsDropdown.vue';
import { canDeleteClients, canUpdateClients } from '@/utils/permissions';

export default {
	components: {
		ArchiveBoxIcon,
		PencilSquareIcon,
		TrashIcon,
		MoreOptionsDropdown,
	},
	props: {
		client: {
			type: Object,
			required: true,
		},
	},
	emits: ['delete', 'edit', 'archive'],
	setup(props, { emit }) {
		return {
			canUpdateClients,
			canDeleteClients,
			emit,
		};
	},
};
</script>

<template>
	<MoreOptionsDropdown :label="'Actions for Client ' + client.name">
		<div class="min-w-[150px]">
			<button
				v-if="canUpdateClients()"
				:aria-label="'Edit Client ' + client.name"
				data-testid="client_edit"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('edit')"
			>
				<PencilSquareIcon class="w-5 text-icon-active"></PencilSquareIcon>
				<span>Edit</span>
			</button>
			<button
				v-if="canUpdateClients()"
				:aria-label="'Archive Client ' + client.name"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click.prevent="emit('archive')"
			>
				<ArchiveBoxIcon class="w-5 text-icon-active"></ArchiveBoxIcon>
				<span>{{ client.is_archived ? 'Unarchive' : 'Archive' }}</span>
			</button>
			<button
				v-if="canDeleteClients()"
				:aria-label="'Delete Client ' + client.name"
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
