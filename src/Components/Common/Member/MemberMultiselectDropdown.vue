<script>
import MultiselectDropdown from '@/packages/ui/src/Input/MultiselectDropdown.vue';
import { useMembersStore } from '@/utils/useMembers';
import { storeToRefs } from 'pinia';

export default {
	components: {
		MultiselectDropdown,
	},
	setup() {
		const membersStore = useMembersStore();
		const { members } = storeToRefs(membersStore);

		function getKeyFromItem(item) {
			return item.id;
		}

		function getNameForItem(item) {
			return item.name;
		}

		return {
			members,
			getKeyFromItem,
			getNameForItem,
		};
	},
};
</script>

<template>
	<MultiselectDropdown
		search-placeholder="Search for a Member..."
		:items="members"
		:get-key-from-item="getKeyFromItem"
		:get-name-for-item="getNameForItem"
	>
		<template #trigger>
			<slot name="trigger"></slot>
		</template>
	</MultiselectDropdown>
</template>
