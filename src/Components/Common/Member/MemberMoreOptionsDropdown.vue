<script>
import { TrashIcon, UserCircleIcon, PencilSquareIcon, ArrowDownOnSquareStackIcon } from '@heroicons/vue/20/solid';
import MoreOptionsDropdown from '@/packages/ui/src/MoreOptionsDropdown.vue';
import { canDeleteMembers, canMakeMembersPlaceholders, canMergeMembers, canUpdateMembers } from '@/utils/permissions';

export default {
	components: {
		TrashIcon,
		UserCircleIcon,
		PencilSquareIcon,
		ArrowDownOnSquareStackIcon,
		MoreOptionsDropdown,
	},
	props: {
		member: {
			type: Object,
			required: true,
		},
	},
	emits: ['delete', 'edit', 'merge', 'makePlaceholder'],
	setup(props, { emit }) {
		return {
			canDeleteMembers,
			canMakeMembersPlaceholders,
			canMergeMembers,
			canUpdateMembers,
			emit,
		};
	},
};
</script>

<template>
	<MoreOptionsDropdown v-if="canUpdateMembers() || canDeleteMembers()" :label="'Actions for Member ' + member.name">
		<div class="min-w-[150px]">
			<button
				v-if="canUpdateMembers()"
				:aria-label="'Edit Member ' + member.name"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('edit')"
			>
				<PencilSquareIcon class="w-5 text-icon-active"></PencilSquareIcon>
				<span>Edit</span>
			</button>
			<button
				v-if="canDeleteMembers()"
				:aria-label="'Delete Member ' + member.name"
				data-testid="member_delete"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('delete')"
			>
				<TrashIcon class="w-5 text-icon-active"></TrashIcon>
				<span>Delete</span>
			</button>
			<button
				v-if="member.role === 'placeholder' && canMergeMembers()"
				:aria-label="'Merge Member ' + member.name"
				data-testid="member_merge"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('merge')"
			>
				<ArrowDownOnSquareStackIcon class="w-5 text-icon-active"></ArrowDownOnSquareStackIcon>
				<span>Merge</span>
			</button>
			<button
				v-if="member.role !== 'placeholder' && canMakeMembersPlaceholders()"
				:aria-label="'Make Member ' + member.name + ' a placeholder'"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="emit('makePlaceholder')"
			>
				<UserCircleIcon class="w-5 text-icon-active"></UserCircleIcon>
				<span>Deactivate</span>
			</button>
		</div>
	</MoreOptionsDropdown>
</template>

<style scoped></style>
