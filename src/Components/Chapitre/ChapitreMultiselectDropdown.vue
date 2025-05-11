<script setup>
import { storeToRefs } from 'pinia';
import { useChapitresStore } from '@/store/chapitres';
import MultiselectDropdown from '@/Components/src/Input/MultiselectDropdown.vue';

const { chapitres } = storeToRefs(useChapitresStore());
const getKeyFromItem = (item) => item.id;
const getNameForItem = (item) => item.name;
</script>

<template>
	<MultiselectDropdown
		search-placeholder="Rechercher une chapitre..."
		:items="chapitres"
		:get-key-from-item="getKeyFromItem"
		:get-name-for-item="getNameForItem"
	>
		<template #trigger>
			<slot name="trigger"></slot>
		</template>
	</MultiselectDropdown>
</template>
