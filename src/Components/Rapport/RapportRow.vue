<script setup>
import { formatHumanReadableDuration } from '@/Components/src/utils/time';
import GroupedItemsCountButton from '@/Components/src/GroupedItemsCountButton.vue';
import { ref } from 'vue';
import { twMerge } from 'tailwind-merge';

const props = defineProps({
	entry: {
		type: Object,
		required: true,
	},
	indent: {
		type: Boolean,
		default: false,
	},
});

const expanded = ref(false);
</script>

<template>
	<div
		class="contents text-text-primary [&>*]:transition [&>*]:border-card-background-separator [&>*]:border-b [&>*]:h-[50px]"
	>
		<div :class="twMerge('pl-6 font-medium flex items-center space-x-3', props.indent ? 'pl-16' : '')">
			<GroupedItemsCountButton
				v-if="entry.grouped_data && entry.grouped_data.length > 0"
				:expanded="expanded"
				@click="expanded = !expanded"
			>
				{{ entry.grouped_data.length }}
			</GroupedItemsCountButton>
			<span>
				{{ entry.chapitre_name }}
			</span>
		</div>
		<div class="justify-end flex items-center">
			{{ formatHumanReadableDuration(entry.seconds) }}
		</div>
	</div>
	<div
		v-if="expanded && entry.grouped_data"
		class="col-span-3 grid bg-quaternary"
		style="grid-template-columns: 1fr 150px 150px"
	>
		<RapportRow
			v-for="subEntry in entry.grouped_data"
			:key="subEntry.chapitre_name || 'none'"
			indent
			:entry="subEntry"
		></RapportRow>
	</div>
</template>

<style scoped></style>
