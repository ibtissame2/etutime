<script setup>
import { onMounted, ref } from 'vue';
import { twMerge } from 'tailwind-merge';

const props = defineProps({
	name: {
		type: String,
		required: false,
	},
	class: {
		type: String,
		required: false,
	},
});

const input = ref(null);
const model = defineModel();

onMounted(() => {
	if (input.value?.hasAttribute('autofocus')) {
		input.value?.focus();
	}
});

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
	<input
		ref="input"
		v-model="model"
		:class="
			twMerge(
				'border-input-border border bg-input-background text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent rounded-md shadow-sm',
				props.class
			)
		"
		:name="name"
	/>
</template>
