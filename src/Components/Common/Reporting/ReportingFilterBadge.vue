<script setup>
import Badge from '@/Components/src/Badge.vue';
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge';

const props = defineProps({
	icon: {
		type: Function,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	count: {
		type: Number,
		default: 0,
	},
	active: {
		type: Boolean,
		default: false,
	},
});

const activeClass = computed(() => {
	return props.active ? 'border-accent-300/50 bg-accent-300/10 hover:bg-accent-300/20' : '';
});
</script>

<template>
	<Badge
		size="large"
		tag="button"
		:class="twMerge('cursor-pointer bg-input-background hover:bg-card-background transition flex', activeClass)"
	>
		<component :is="icon" class="-ml-0.5 h-4 w-4 text-text-quaternary" />
		<span>{{ title }}</span>
		<div v-if="count" class="bg-accent-300/20 w-5 h-5 font-medium rounded flex items-center transition justify-center">
			{{ count }}
		</div>
	</Badge>
</template>

<style scoped></style>
