<script setup>
import { ref, watch } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
	class: { type: String, required: false },
	tabindex: { type: String, required: false },
});

const emit = defineEmits(['changed']);

const model = defineModel({ default: null });

const date = ref(dayjs(model.value).format('YYYY-MM-DD'));

watch(model, (value) => (date.value = dayjs(value).format('YYYY-MM-DD')));

function updateDate(event) {
	const newDate = dayjs(event.target.value);
	if (newDate.isValid()) {
		model.value = dayjs(model.value)
			.set('year', newDate.year())
			.set('month', newDate.month())
			.set('date', newDate.date())
			.format();
		emit('changed', model.value);
	}
}
</script>

<template>
	<div class="flex items-center text-muted">
		<input
			id="start"
			:tabindex="tabindex"
			class="bg-input-background border text-text-primary border-input-border focus-visible:outline-0 focus-visible:border-input-border-active focus-visible:ring-0 rounded-md"
			:class="props.class"
			type="date"
			name="trip-start"
			:value="date"
			@change="(value) => (date = dayjs(event.target.value).format('YYYY-MM-DD'))"
			@blur="updateDate"
			@keydown.enter="updateDate"
		/>
	</div>
</template>

<style scoped>
input::-webkit-calendar-picker-indicator {
	filter: invert(1);
	opacity: 0.2;
}
</style>
