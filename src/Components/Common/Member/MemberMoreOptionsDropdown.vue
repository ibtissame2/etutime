<script setup>
import { TrashIcon, UserCircleIcon, PencilSquareIcon, ArrowDownOnSquareStackIcon } from '@heroicons/vue/20/solid';
import MoreOptionsDropdown from '@/Components/src/MoreOptionsDropdown.vue';

const emit = defineEmits(['delete', 'edit', 'merge', 'makePlaceholder']);

const props = defineProps({
	member: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<MoreOptionsDropdown :label="'Actions for Member ' + props.member.name">
		<div class="min-w-[150px]">
			<button
				:aria-label="'Edit Member ' + props.member.name"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('edit')"
			>
				<PencilSquareIcon class="w-5 text-icon-active" />
				<span>Edit</span>
			</button>

			<button
				:aria-label="'Delete Member ' + props.member.name"
				data-testid="member_delete"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('delete')"
			>
				<TrashIcon class="w-5 text-icon-active" />
				<span>Delete</span>
			</button>

			<button
				v-if="props.member.role === 'placeholder'"
				:aria-label="'Merge Member ' + props.member.name"
				data-testid="member_merge"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('merge')"
			>
				<ArrowDownOnSquareStackIcon class="w-5 text-icon-active" />
				<span>Merge</span>
			</button>

			<button
				v-if="props.member.role !== 'placeholder'"
				:aria-label="'Make Member ' + props.member.name + ' a placeholder'"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('makePlaceholder')"
			>
				<UserCircleIcon class="w-5 text-icon-active" />
				<span>Deactivate</span>
			</button>
		</div>
	</MoreOptionsDropdown>
</template>

<style scoped></style>
