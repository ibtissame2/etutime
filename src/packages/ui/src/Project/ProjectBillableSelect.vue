<script setup>
import SelectDropdown from '@/packages/ui/src/Input/SelectDropdown.vue';
import Badge from '@/packages/ui/src/Badge.vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';

const model = defineModel({ default: 'non-billable' });

const options = [
	{
		key: 'non-billable',
		name: 'Non-billable',
	},
	{
		key: 'default-rate',
		name: 'Default Rate',
	},
	{
		key: 'custom-rate',
		name: 'Custom Rate',
	},
];

function getKeyFromItem(item) {
	return item.key;
}

function getNameFromItem(item) {
	return item.name;
}

function getNameForKey(key) {
	const item = options.find((item) => getKeyFromItem(item) === key);
	if (item) {
		return getNameFromItem(item);
	}
	return '';
}
</script>

<template>
	<SelectDropdown
		v-model="model"
		:get-key-from-item="getKeyFromItem"
		:get-name-for-item="getNameFromItem"
		:items="options"
	>
		<template #trigger>
			<Badge tag="button" size="xlarge" class="bg-input-background cursor-pointer">
				<span>{{ getNameForKey(model) }}</span>
				<ChevronDownIcon class="text-muted w-5"></ChevronDownIcon>
			</Badge>
		</template>
	</SelectDropdown>
</template>

<style scoped></style>
