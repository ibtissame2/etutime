<script setup>
import DurationInput from '@/Components/src/Input/DurationInput.vue';
import { ClockIcon } from '@heroicons/vue/20/solid';

const model = defineModel();
const emit = defineEmits(['submit']);
</script>

<template>
	<div class="pt-6">
		<div class="flex items-center space-x-1 mb-2">
			<ClockIcon class="text-text-quaternary w-4"></ClockIcon>
		</div>
		<DurationInput v-model="model" class="max-w-[150px]" @submit="emit('submit')"></DurationInput>
	</div>
</template>

<style scoped></style>
