<script setup>
import { ref, watch } from 'vue';
import { getDayJsInstance, getLocalizedDayJs } from '@/Components/src/utils/time';
import { twMerge } from 'tailwind-merge';

const props = defineProps({
	class: {
		type: String,
		required: false,
	},
	tabindex: {
		type: String,
		required: false,
	},
});

const model = defineModel({ default: null });
const tempDate = ref(getLocalizedDayJs(model.value).format('YYYY-MM-DD'));
const datePicker = ref(null);
const emit = defineEmits(['changed']);

watch(model, (value) => {
	tempDate.value = getLocalizedDayJs(value).format('YYYY-MM-DD');
});

function updateDate(event) {
	const target = event.target;
	const newValue = target.value;
	const newDate = getDayJsInstance()(newValue);

	if (newDate.isValid()) {
		model.value = getLocalizedDayJs(model.value)
			.set('year', newDate.year())
			.set('month', newDate.month())
			.set('date', newDate.date())
			.format();
		emit('changed', model.value);
	}
}

function updateTempValue(event) {
	const target = event.target;
	tempDate.value = target.value;
}
</script>

<template>
	<div class="flex items-center text-muted">
		<input
			id="start"
			ref="datePicker"
			:tabindex="tabindex"
			:class="
				twMerge(
					'bg-input-background border text-text-primary border-input-border focus-visible:outline-0 focus-visible:border-input-border-active focus-visible:ring-0 rounded-md',
					props.class
				)
			"
			type="date"
			name="trip-start"
			:value="tempDate"
			@change="updateTempValue"
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
