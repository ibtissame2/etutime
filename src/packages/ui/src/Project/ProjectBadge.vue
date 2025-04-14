<script setup>
import { twMerge } from 'tailwind-merge';
import Badge from '@/packages/ui/src/Badge.vue';

const props = defineProps({
	name: { type: String, default: '' },
	size: { type: String, default: 'base' },
	tag: { type: String, default: 'div' },
	class: { type: String, required: false },
	color: { type: String, default: 'var(--theme-color-icon-default)' },
	border: { type: Boolean, default: true },
});

const indicatorClasses = {
	base: 'w-2.5 h-2.5',
	large: 'w-2 sm:w-3 h-2 sm:h-3',
	xlarge: 'w-3 sm:w-4 h-3 sm:h-4',
};
</script>

<template>
	<Badge :name :size :tag :class="props.class" :color :border>
		<div
			:style="{ backgroundColor: props.color }"
			:class="twMerge(indicatorClasses[size], 'inline-block rounded-full shrink-0')"
		></div>
		<div class="min-w-0">
			<slot>
				{{ name }}
			</slot>
		</div>
	</Badge>
</template>

<style scoped></style>
