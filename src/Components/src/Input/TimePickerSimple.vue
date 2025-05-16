<script setup>
import { ref, watch } from 'vue';
import { useFocus } from '@vueuse/core';
import TextInput from '@/Components/src/Input/TextInput.vue';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

const model = defineModel({ default: null });

const props = defineProps({
	size: {
		type: String,
		default: 'base',
	},
	focus: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['changed']);
const timeInput = ref(null);
const inputValue = ref(model.value ? dayjs(model.value).format('HH:mm') : null);

useFocus(timeInput, { initialValue: props.focus });

function updateTime(event) {
	const target = event.target;
	const newValue = target.value.trim();
	if (newValue.split(':').length === 2) {
		const [hours, minutes] = newValue.split(':');
		if (!isNaN(parseInt(hours)) && !isNaN(parseInt(minutes))) {
			model.value = dayjs(model.value)
				.set('hours', Math.min(parseInt(hours), 23))
				.set('minutes', Math.min(parseInt(minutes), 59))
				.format();
			emit('changed', model.value);
		}
	} else if (/^\d+$/.test(newValue)) {
		if (newValue.length === 4) {
			const [hours, minutes] = [newValue.slice(0, 2), newValue.slice(2, 4)];
			model.value = dayjs(model.value)
				.set('hours', Math.min(parseInt(hours), 23))
				.set('minutes', Math.min(parseInt(minutes), 59))
				.format();
			emit('changed', model.value);
		} else if (newValue.length === 3) {
			const [hours, minutes] = [newValue.slice(0, 1), newValue.slice(1, 3)];
			model.value = dayjs(model.value)
				.set('hours', Math.min(parseInt(hours), 23))
				.set('minutes', Math.min(parseInt(minutes), 59))
				.format();
			emit('changed', model.value);
		} else if (newValue.length === 2) {
			model.value = dayjs(model.value)
				.set('hours', Math.min(parseInt(newValue), 23))
				.set('minutes', 0)
				.format();
			emit('changed', model.value);
		} else if (newValue.length === 1) {
			model.value = dayjs(model.value)
				.set('hours', Math.min(parseInt(newValue), 23))
				.set('minutes', 0)
				.format();
			emit('changed', model.value);
		}
	}

	inputValue.value = dayjs(model.value).format('HH:mm');
}

watch(model, (value) => {
	inputValue.value = value ? dayjs(value).format('HH:mm') : null;
});
</script>

<template>
	<TextInput
		v-bind="$attrs"
		ref="timeInput"
		v-model="inputValue"
		:class="twMerge('text-center w-24 px-3 py-2', size === 'large' && 'w-28')"
		data-testid="time_picker_input"
		type="text"
		@blur="updateTime"
		@focus="$event.target.select()"
		@mouseup="$event.target.select()"
		@click="$event.target.select()"
		@pointerup="$event.target.select()"
	/>
</template>

<style scoped></style>
