<script setup>
import { twMerge } from 'tailwind-merge';

const props = defineProps({
	value: {
		type: String,
		required: false,
	},
	class: {
		type: String,
		required: false,
	},
});
</script>

<template>
	<label :class="twMerge('block font-medium text-sm text-text-primary', props.class)">
		<span v-if="value">{{ value }}</span>
		<span v-else><slot /></span>
	</label>
</template>
