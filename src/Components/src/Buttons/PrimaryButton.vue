<script setup>
import LoadingSpinner from '@/Components/src/LoadingSpinner.vue';
import { twMerge } from 'tailwind-merge';

const props = defineProps({
	type: {
		type: String,
		required: false,
		default: 'submit',
	},
	icon: {
		type: Function,
		required: false,
	},
	loading: {
		type: Boolean,
		required: false,
		default: false,
	},
});
</script>

<template>
	<button
		:type="type"
		:disabled="loading"
		class="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 bg-button-primary-background border border-button-primary-border rounded-md font-medium text-xs sm:text-sm text-button-primary-text hover:bg-button-primary-background-hover active:bg-button-primary-background-hover focus:outline-none focus-visible:ring-2 focus-visible:border-transparent focus-visible:ring-ring transition ease-in-out duration-150"
	>
		<span :class="twMerge('flex items-center ', props.icon ? 'space-x-1.5' : '')">
			<LoadingSpinner v-if="loading"></LoadingSpinner>
			<component :is="props.icon" v-if="props.icon && !loading" class="w-4 -ml-0.5 mr-1"></component>
			<span>
				<slot />
			</span>
		</span>
	</button>
</template>
