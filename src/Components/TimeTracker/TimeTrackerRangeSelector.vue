<script setup>
import Dropdown from '@/Components/src/Input/Dropdown.vue';
import { computed, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import parse from 'parse-duration';
import { useCurrentTimerStore } from '@/store/current-timer';
import { formatDuration, getDayJsInstance } from '@/Components/src/utils/time';
import TimeRangeSelector from '@/Components/src/Input/TimeRangeSelector.vue';

const timer = defineModel({ required: true });

const emit = defineEmits(['createTimer']);

const { clock } = storeToRefs(useCurrentTimerStore());
const { startClock, stopClock } = useCurrentTimerStore();
const temporaryCustomTimerEntry = ref('');
const timeRangeSelector = ref(null);
const inputField = ref(null);
const open = ref(false);
const HHMMtimeRegex = /^([0-9]{1,2}):([0-5]?[0-9])$/;

const startTime = computed(() => {
	if (timer.value.start && timer.value.start !== '') {
		return timer.value.start;
	}
	return dayjs().utc().format();
});

const currentTime = computed({
	get() {
		if (temporaryCustomTimerEntry.value !== '') {
			return temporaryCustomTimerEntry.value;
		}
		if (clock.value && timer.value.start) {
			const diff = clock.value.diff(dayjs(timer.value.start), 'seconds');
			return formatDuration(diff);
		}
		return null;
	},
	set(newValue) {
		if (newValue) {
			temporaryCustomTimerEntry.value = newValue;
		} else {
			temporaryCustomTimerEntry.value = '';
		}
	},
});

function pauseLiveTimerUpdate(event) {
	event.target.select();
	stopClock();
}

function onTimeEntryEnterPress() {
	updateTimerAndStartLiveTimerUpdate();
	const activeElement = document.activeElement;
	activeElement?.blur();
}

async function updateTimeRange(newStart) {
	if (getDayJsInstance()(newStart).isBefore(getDayJsInstance()())) {
		timer.value.start = newStart;
		emit('createTimer');
	}
}

function updateTimerAndStartLiveTimerUpdate() {
	const time = parse(temporaryCustomTimerEntry.value, 's');

	if (isNumeric(temporaryCustomTimerEntry.value)) {
		const newStartDate = dayjs().subtract(parseInt(temporaryCustomTimerEntry.value), 'm');
		timer.value.start = newStartDate.utc().format();
		emit('createTimer');
	} else if (isHHMM(temporaryCustomTimerEntry.value)) {
		const results = parseHHMM(temporaryCustomTimerEntry.value);
		if (results) {
			const newStartDate = dayjs().subtract(parseInt(results[1]), 'h').subtract(parseInt(results[2]), 'm');
			timer.value.start = newStartDate.utc().format();
			emit('createTimer');
		}
	} else if (time && time > 1) {
		const newStartDate = dayjs().subtract(time, 's');
		timer.value.start = newStartDate.utc().format();
		emit('createTimer');
	}
	clock.value = dayjs().utc();
	temporaryCustomTimerEntry.value = '';
	startClock();
}

function isNumeric(value) {
	return /^-?\d+$/.test(value);
}

function isHHMM(value) {
	return HHMMtimeRegex.test(value);
}

function parseHHMM(value) {
	return value.match(HHMMtimeRegex);
}

function openModalOnTab(e) {
	const source = e.relatedTarget;
	if (source && window.document.body.querySelector('#app')?.contains(source)) {
		open.value = true;
	}
}

function focusNextElement(e) {
	if (open.value) {
		e.preventDefault();
		const focusableElement = timeRangeSelector.value?.querySelector(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		focusableElement?.focus();
	}
}

onMounted(async () => (clock.value = dayjs().utc()));
</script>

<template>
	<div class="relative">
		<Dropdown v-model="open" :align="'bottom'" :close-on-content-click="false" @submit="open = false">
			<template #trigger>
				<input
					ref="inputField"
					v-model="currentTime"
					placeholder="00:00:00"
					data-testid="time_entry_time"
					class="w-[110px] lg:w-[130px] h-full text-text-primary py-2.5 rounded-lg border-border-secondary border text-center px-4 text-base lg:text-lg font-semibold bg-card-background border-none placeholder-muted focus:ring-0 transition"
					type="text"
					@focus="pauseLiveTimerUpdate"
					@focusin="openModalOnTab"
					@keydown.exact.tab="focusNextElement"
					@keydown.exact.shift.tab="open = false"
					@keydown.enter="onTimeEntryEnterPress"
				/>
			</template>
			<template #content>
				<div ref="timeRangeSelector">
					<TimeRangeSelector :start="startTime" :end-visible="false" :end="null" @changed="updateTimeRange">
					</TimeRangeSelector>
				</div>
			</template>
		</Dropdown>
	</div>
</template>

<style></style>
