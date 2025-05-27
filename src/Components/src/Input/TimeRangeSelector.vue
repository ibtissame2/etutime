<script setup>
import dayjs from 'dayjs';
import { nextTick, ref, watch } from 'vue';
import { useFocusWithin } from '@vueuse/core';
import DatePicker from '@/Components/src/Input/DatePicker.vue';
import TimePickerSimple from '@/Components/src/Input/TimePickerSimple.vue';

const props = defineProps({
	start: String,
	end: { type: [String, null], default: null },
	endVisible: Boolean,
	focus: { type: Boolean, default: false },
});

const emit = defineEmits(['changed', 'close']);

const tempStart = ref(props.start || dayjs().format('YYYY-MM-DD HH:mm:ss'));
const tempEnd = ref(props.end || null);
const dropdownContent = ref();
const { focused } = useFocusWithin(dropdownContent);

watch(props, () => {
	tempStart.value = props.start;
	tempEnd.value = props.end || null;
});

watch(focused, (newValue, oldValue) => {
	if (oldValue === true && newValue === false) updateRange();
});

function updateRange() {
	const start = dayjs(tempStart.value).format('YYYY-MM-DD HH:mm:ss');
	const end = tempEnd.value ? dayjs(tempEnd.value).format('YYYY-MM-DD HH:mm:ss') : null;
	if (start !== props.start || end !== props.end) emit('changed', start, end);
}
</script>

<template>
	<div
		ref="dropdownContent"
		:class="`grid ${
			endVisible ? 'grid-cols-2' : 'grid-cols-1'
		} divide-x divide-card-background-separator text-center py-2`"
	>
		<div class="px-2" @keydown.enter.prevent="nextTick(() => emit('close'))">
			<div class="font-semibold text-text-primary text-sm pb-2">Début</div>
			<div class="space-y-2">
				<TimePickerSimple
					v-model="tempStart"
					data-testid="time_entry_range_start"
					tabindex="0"
					:focus
					@keydown.exact.tab.shift.stop.prevent="emit('close')"
					@changed="updateRange"
				/>
				<DatePicker
					v-model="tempStart"
					class="text-xs text-text-tertiary max-w-24 px-1.5 py-1.5"
					@changed="updateRange"
					@blur.stop.prevent="emit('close')"
				/>
			</div>
		</div>
		<div v-if="endVisible" class="px-2">
			<div class="font-semibold text-text-primary text-sm pb-2">Fin</div>
			<div v-if="tempEnd !== null" class="space-y-2">
				<TimePickerSimple v-model="tempEnd" data-testid="time_entry_range_end" @changed="updateTimeEntry" />
				<DatePicker
					v-model="tempEnd"
					class="text-xs text-text-tertiary max-w-24 px-1.5 py-1.5"
					@changed="updateTimeEntry"
				/>
			</div>
			<div v-else class="text-muted">-- : --</div>
			<div tabindex="0" @focusin="emit('close')"></div>
		</div>
	</div>
</template>
