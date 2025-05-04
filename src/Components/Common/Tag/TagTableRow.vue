<script setup>
import { useTachesStore } from '@/store/taches';
import TagMoreOptionsDropdown from '@/Components/Common/Tag/TagMoreOptionsDropdown.vue';
import TableRow from '@/Components/TableRow.vue';

const props = defineProps({
	tag: Object,
});

const { deleteTache } = useTachesStore();
</script>

<template>
	<TableRow>
		<div
			class="whitespace-nowrap flex items-center space-x-5 3xl:pl-12 py-4 pr-3 text-sm font-medium text-text-primary pl-4 sm:pl-6 lg:pl-8 3xl:pl-12"
		>
			<span>
				{{ tag.name }}
			</span>
		</div>
		<div
			class="relative whitespace-nowrap flex items-center pl-3 text-right text-sm font-medium sm:pr-0 pr-4 sm:pr-6 lg:pr-8 3xl:pr-12"
		>
			<TagMoreOptionsDropdown :tag="tag" @delete="deleteTache(tag.id)"></TagMoreOptionsDropdown>
		</div>
	</TableRow>
</template>

<style scoped></style>
