<script>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMembersStore } from '@/utils/useMembers';
import { UserIcon, ChevronDownIcon } from '@heroicons/vue/24/solid';
import { useFocus } from '@vueuse/core';
import { Badge, SelectDropdown } from '@/packages/ui/src';

export default {
	components: {
		UserIcon,
		ChevronDownIcon,
		Badge,
		SelectDropdown,
	},
	props: {
		hiddenMembers: {
			type: Array,
			default: () => [],
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const membersStore = useMembersStore();
		const { members } = storeToRefs(membersStore);
		const model = ref('');
		const searchInput = ref(null);
		const searchValue = ref('');

		useFocus(searchInput, { initialValue: true });

		const filteredMembers = computed(() => {
			return members.value.filter((member) => {
				return (
					member.name.toLowerCase().includes(searchValue.value?.toLowerCase()?.trim() || '') &&
					!props.hiddenMembers.some((hiddenMember) => hiddenMember.member_id === member.id) &&
					member.is_placeholder === false
				);
			});
		});

		const currentValue = computed(() => {
			if (model.value) {
				return members.value.find((member) => member.id === model.value)?.name;
			}
			return searchValue.value;
		});

		return {
			model,
			members,
			searchInput,
			searchValue,
			filteredMembers,
			currentValue,
		};
	},
};
</script>

<template>
	<SelectDropdown
		v-model="model"
		:items="filteredMembers"
		:get-key-from-item="(member) => member.id"
		:get-name-for-item="(member) => member.name"
	>
		<template #trigger>
			<Badge
				tag="button"
				class="flex w-full text-base text-left space-x-3 px-3 text-text-secondary bg-input-background font-normal cursor py-1.5"
			>
				<UserIcon class="relative z-10 w-4 text-muted"></UserIcon>
				<div v-if="currentValue" class="flex-1 truncate">
					{{ currentValue }}
				</div>
				<div v-else class="flex-1">Select a member...</div>
				<ChevronDownIcon class="w-4 text-muted"></ChevronDownIcon>
			</Badge>
		</template>
	</SelectDropdown>
</template>

<style scoped></style>
