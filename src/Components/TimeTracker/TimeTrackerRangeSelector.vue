<script setup>
import { computed, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import parse from 'parse-duration';
import { useMinuteursStore } from '@/store/minuteurs';
import { formatDuration } from '@/Components/src/utils/time';
import TimeRangeSelector from '@/Components/src/Input/TimeRangeSelector.vue';
import Dropdown from '@/Components/src/Input/Dropdown.vue';

const minuteur = defineModel({ required: true });

const emit = defineEmits(['createTimer']);

const props = defineProps({
	disabled: { type: Boolean, default: false },
});

const { clock } = storeToRefs(useMinuteursStore());
const temporaryCustomTimerEntry = ref('');
const timeRangeSelector = ref(null);
const inputField = ref(null);
const open = ref(false);
const HHMMtimeRegex = /^([0-9]{1,2}):([0-5]?[0-9])$/;

const startTime = computed(() => minuteur.value.start || dayjs().format('YYYY-MM-DD HH:mm:ss'));

const currentTime = computed({
	get() {
		if (temporaryCustomTimerEntry.value !== '') return temporaryCustomTimerEntry.value;
		if (!clock.value || !minuteur.value.start) return null;
		return formatDuration(clock.value.diff(dayjs(minuteur.value.start), 'seconds'));
	},
	set(newValue) {
		temporaryCustomTimerEntry.value = newValue || '';
	},
});

function onTimeEntryEnterPress() {
	updateTimerAndStartLiveTimerUpdate();
	const activeElement = document.activeElement;
	activeElement?.blur();
}

async function updateTimeRange(newStart) {
	if (dayjs(newStart).isBefore(dayjs())) {
		minuteur.value.start = newStart;
		emit('createTimer');
	}
}

function updateTimerAndStartLiveTimerUpdate() {
	const time = parse(temporaryCustomTimerEntry.value, 's');

	let newStartDate;
	if (isNumeric(temporaryCustomTimerEntry.value)) {
		newStartDate = dayjs().subtract(parseInt(temporaryCustomTimerEntry.value), 'm');
	} else if (isHHMM(temporaryCustomTimerEntry.value)) {
		const time = parseHHMM(temporaryCustomTimerEntry.value);
		if (time) newStartDate = dayjs().subtract(parseInt(time[1]), 'h').subtract(parseInt(time[2]), 'm');
	} else if (time && time > 1) {
		newStartDate = dayjs().subtract(time, 's');
	}
	if (newStartDate) {
		minuteur.value.start = newStartDate.format('YYYY-MM-DD HH:mm:ss');
		emit('createTimer');
	}
	temporaryCustomTimerEntry.value = '';
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
					:disabled="disabled"
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
