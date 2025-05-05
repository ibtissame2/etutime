<script setup>
import parse from 'parse-duration';
import { onMounted, ref, watch } from 'vue';
import { formatHumanReadableDuration, getDayJsInstance } from '@/Components/src/utils/time';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import TextInput from '@/Components/src/Input/TextInput.vue';

const temporaryCustomTimerEntry = ref('');
const start = defineModel('start', { default: '' });
const end = defineModel('end', { default: '' });
const HHMMtimeRegex = /^([0-9]{1,2}):([0-5]?[0-9])$/;

const props = defineProps({
	class: {
		type: String,
		required: false,
	},
});

function isHHMM(value) {
	return HHMMtimeRegex.test(value);
}

function parseHHMM(value) {
	return value.match(HHMMtimeRegex);
}

function isNumeric(value) {
	return /^-?\d+$/.test(value);
}

function updateDuration() {
	const time = parse(temporaryCustomTimerEntry.value, 's');

	if (isNumeric(temporaryCustomTimerEntry.value)) {
		const newStartDate = getDayJsInstance()(end.value).subtract(parseInt(temporaryCustomTimerEntry.value), 'm');
		start.value = newStartDate.utc().format();
	} else if (isHHMM(temporaryCustomTimerEntry.value)) {
		const results = parseHHMM(temporaryCustomTimerEntry.value);
		if (results) {
			const newStartDate = getDayJsInstance()(end.value)
				.subtract(parseInt(results[1]), 'h')
				.subtract(parseInt(results[2]), 'm');
			start.value = newStartDate.utc().format();
		}
	} else if (time && time > 1) {
		const newStartDate = getDayJsInstance()(end.value).subtract(time, 's');
		start.value = newStartDate.utc().format();
	}
	updateTimeEntryInputValue();
}

function updateTimeEntryInputValue() {
	if (start.value && end.value) {
		const startTime = dayjs(start.value);
		const diff = getDayJsInstance()(end.value).diff(startTime, 'seconds');
		temporaryCustomTimerEntry.value = formatHumanReadableDuration(diff);
	}
}

watch([start, end], updateTimeEntryInputValue);
onMounted(() => updateTimeEntryInputValue());
</script>

<template>
	<TextInput
		ref="inputField"
		v-model="temporaryCustomTimerEntry"
		:class="twMerge('text-text-secondary', props.class)"
		type="text"
		@blur="updateDuration"
		@keydown.enter="updateDuration"
	/>
</template>

<style scoped></style>
