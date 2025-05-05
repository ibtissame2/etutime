<script setup>
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
	highlighted: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<div class="px-1">
		<div
			:class="
				twMerge(
					'flex items-center space-x-3 w-full px-1.5 py-1.5 rounded text-start text-sm font-medium leading-5 text-text-primary focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out cursor-pointer',
					props.highlighted && 'bg-card-background-active',
					props.selected ? 'bg-accent-300/20' : 'hover:bg-card-background-active'
				)
			"
		>
			<span>{{ name }}</span>
		</div>
	</div>
</template>

<style scoped></style>
