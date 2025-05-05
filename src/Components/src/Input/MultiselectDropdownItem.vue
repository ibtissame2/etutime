<script setup>
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge';

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	selected: {
		type: Boolean,
		default: false,
	},
});

const iconClasses = computed(() => {
	return props.selected ? 'text-input-select-active' : 'text-text-quaternary opacity-50';
});
</script>

<template>
	<div
		class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
	>
		<CheckCircleIcon :class="twMerge(iconClasses, 'w-5')" />
		<span class="flex-1 min-w-0 overflow-ellipsis overflow-hidden">{{ name }}</span>
	</div>
</template>

<style scoped></style>
