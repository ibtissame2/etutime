<script setup>
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';

const props = defineProps({
	active: {
		type: Boolean,
		default: false,
	},
});

const activeClass = computed(() => {
	return props.active ? 'bg-tab-background border border-tab-border text-text-primary font-semibold' : '';
});
</script>

<template>
	<button
		role="tab"
		:class="
			twMerge(
				'rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium hover:text-text-primary focus-visible:outline-none',
				activeClass
			)
		"
	>
		<slot></slot>
	</button>
</template>

<style scoped></style>
