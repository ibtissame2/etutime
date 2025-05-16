<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['update:checked']);

const props = defineProps({
	checked: {
		type: [Array, Boolean],
		default: false,
	},
	id: {
		type: [String, null],
		default: null,
	},
});

const proxyChecked = ref(props.checked);

watch(proxyChecked, (value) => {
	if (props.checked !== value) emit('update:checked', value);
});

watch(
	() => props.checked,
	(value) => proxyChecked.value !== value && (proxyChecked.value = value)
);
</script>

<template>
	<input
		:id="id"
		v-model="proxyChecked"
		type="checkbox"
		class="h-4 w-4 rounded bg-card-background border-input-border text-accent-500/80 focus:outline-none focus:ring-ring/50 focus-visible:outline-none focus-visible:ring-ring/50"
	/>
</template>
