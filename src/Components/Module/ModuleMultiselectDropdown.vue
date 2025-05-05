<script setup>
import { storeToRefs } from 'pinia';
import { useModulesStore } from '@/store/modules';
import MultiselectDropdown from '@/Components/src/Input/MultiselectDropdown.vue';

const { modules } = storeToRefs(useModulesStore());

function getKeyFromItem(item) {
	return item.id;
}

function getNameForItem(item) {
	return item.name;
}
</script>

<template>
	<MultiselectDropdown
		search-placeholder="Rechercher par un module..."
		:items="modules"
		:get-key-from-item="getKeyFromItem"
		:get-name-for-item="getNameForItem"
	>
		<template #trigger>
			<slot name="trigger"></slot>
		</template>
	</MultiselectDropdown>
</template>
