<script>
import MultiselectDropdown from '@/packages/ui/src/Input/MultiselectDropdown.vue';
import { storeToRefs } from 'pinia';
import { useClientsStore } from '@/utils/useClients';

export default {
	components: {
		MultiselectDropdown,
	},
	setup() {
		const clientsStore = useClientsStore();
		const { clients } = storeToRefs(clientsStore);

		function getKeyFromItem(item) {
			return item.id;
		}

		function getNameForItem(item) {
			return item.name;
		}

		return {
			clients,
			getKeyFromItem,
			getNameForItem,
		};
	},
};
</script>

<template>
	<MultiselectDropdown
		search-placeholder="Search for a Client..."
		:items="clients"
		:get-key-from-item="getKeyFromItem"
		:get-name-for-item="getNameForItem"
	>
		<template #trigger>
			<slot name="trigger"></slot>
		</template>
	</MultiselectDropdown>
</template>
