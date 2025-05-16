<script setup>
import dayjs from 'dayjs';
import { computed, ref, watch } from 'vue';
import { useFocus } from '@vueuse/core';
import SelectDropdown from '@/Components/src/Input/SelectDropdown.vue';
import TextInput from '@/Components/src/Input/TextInput.vue';
import { twMerge } from 'tailwind-merge';

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
const open = ref(false);

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

const getStartOptions = computed(() => {
	const options = [];
	for (let hour = 0; hour < 24; hour++) {
		for (let minute = 0; minute < 60; minute += 15) {
			const timestamp = dayjs(model.value).set('hour', hour).set('minute', minute).format();
			const name = dayjs(model.value).set('hour', hour).set('minute', minute).format('HH:mm');
			options.push({ timestamp, name });
		}
	}
	return options;
});

const closestValue = computed({
	get() {
		const target = dayjs(model.value);
		let closestDiff = null;
		let closest = target;
		for (const option of getStartOptions.value) {
			const diff = Math.abs(dayjs(option.timestamp).diff(target));
			if (closestDiff === null || diff < closestDiff) {
				closestDiff = diff;
				closest = dayjs(option.timestamp);
			}
		}
		return closest.format();
	},
	set(value) {
		model.value = value;
		emit('changed', model.value);
	},
});
</script>

<template>
	<div class="flex min-w-0 items-center justify-center text-text-primary">
		<SelectDropdown
			v-model="closestValue"
			v-model:open="open"
			:class="twMerge('mine-w-0 w-24', size === 'large' && 'w-28')"
			:get-key-from-item="(item) => item.timestamp"
			:get-name-for-item="(item) => item.name"
			:items="getStartOptions"
		>
			<template #trigger>
				<TextInput
					ref="timeInput"
					v-model="inputValue"
					:class="twMerge('text-center w-24 px-3 py-2', size === 'large' && 'w-28')"
					data-testid="time_picker_input"
					type="text"
					@blur="updateTime"
					@keydown.enter="
						updateTime($event);
						open = false;
					"
					@keydown.tab="open = false"
					@focus="$event.target.select()"
					@mouseup="$event.target.select()"
					@click="$event.target.select()"
					@pointerup="$event.target.select()"
					@focusin="open = true"
				/>
			</template>
		</SelectDropdown>
	</div>
</template>

<style scoped></style>
