<script setup>
import Dropdown from '@/packages/ui/src/Input/Dropdown.vue';
import { computed, ref } from 'vue';
import TimeRangeSelector from '@/packages/ui/src/Input/TimeRangeSelector.vue';
import dayjs, { Dayjs } from 'dayjs';
import parse from 'parse-duration';
import { formatDuration, getDayJsInstance } from '@/packages/ui/src/utils/time';

const currentTimeEntry = defineModel('currentTimeEntry', { required: true });

const now = defineModel('liveTimer');

const emit = defineEmits(['startLiveTimer', 'stopLiveTimer', 'updateTimer', 'startTimer']);

const open = ref(false);

function pauseLiveTimerUpdate(event) {
    event.target.select();
    emit('stopLiveTimer');
}

function onTimeEntryEnterPress() {
    updateTimerAndStartLiveTimerUpdate();
    const activeElement = document.activeElement;
    activeElement?.blur();
}

const currentTime = computed({
    get() {
        if (temporaryCustomTimerEntry.value !== '') {
            return temporaryCustomTimerEntry.value;
        }
        if (now.value && currentTimeEntry.value.start) {
            const startTime = dayjs(currentTimeEntry.value.start);
            const diff = now.value.diff(startTime, 'seconds');
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

function updateTimerAndStartLiveTimerUpdate() {
    const time = parse(temporaryCustomTimerEntry.value, 's');

    if (isNumeric(temporaryCustomTimerEntry.value)) {
        const newStartDate = dayjs().subtract(
            parseInt(temporaryCustomTimerEntry.value),
            'm'
        );
        currentTimeEntry.value.start = newStartDate.utc().format();
        if (currentTimeEntry.value.id !== '') {
            emit('updateTimer');
        } else {
            emit('startTimer');
        }
    } else if (isHHMM(temporaryCustomTimerEntry.value)) {
        const results = parseHHMM(temporaryCustomTimerEntry.value);
        if (results) {
            const newStartDate = dayjs()
                .subtract(parseInt(results[1]), 'h')
                .subtract(parseInt(results[2]), 'm');
            currentTimeEntry.value.start = newStartDate.utc().format();
            if (currentTimeEntry.value.id !== '') {
                emit('updateTimer');
            } else {
                emit('startTimer');
            }
        }
    }
    else if (time && time > 1) {
        const newStartDate = dayjs().subtract(time, 's');
        currentTimeEntry.value.start = newStartDate.utc().format();
        if (currentTimeEntry.value.id !== '') {
            emit('updateTimer');
        } else {
            emit('startTimer');
        }
    }
    now.value = dayjs().utc();
    temporaryCustomTimerEntry.value = '';
    emit('startLiveTimer');
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

const HHMMtimeRegex = /^([0-9]{1,2}):([0-5]?[0-9])$/;

function isHHMM(value) {
    return HHMMtimeRegex.test(value);
}

function parseHHMM(value) {
    return value.match(HHMMtimeRegex);
}

const temporaryCustomTimerEntry = ref('');

async function updateTimeRange(newStart) {
    if (getDayJsInstance()(newStart).isBefore(getDayJsInstance()())) {
        currentTimeEntry.value.start = newStart;
        if (currentTimeEntry.value.id) {
            emit('updateTimer');
        } else {
            emit('startTimer');
        }
    }
}

const startTime = computed(() => {
    if (currentTimeEntry.value.start && currentTimeEntry.value.start !== '') {
        return currentTimeEntry.value.start;
    }
    return dayjs().utc().format();
});
const inputField = ref(null);

const timeRangeSelector = ref(null);

function openModalOnTab(e) {
    const source = e.relatedTarget;
    if (source && window.document.body.querySelector('#app')?.contains(source)) {
        open.value = true;
    }
}

function focusNextElement(e) {
    if (open.value) {
        e.preventDefault();
        const focusableElement =
            timeRangeSelector.value?.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
        focusableElement?.focus();
    }
}

function closeAndFocusInput() {
    inputField.value?.focus();
    open.value = false;
}
</script>

<template>
    <div class="relative">
        <Dropdown
            v-model="open"
            :align="'bottom'"
            :close-on-content-click="false"
            @submit="open = false">
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
                    @blur="updateTimerAndStartLiveTimerUpdate"
                    @keydown.enter="onTimeEntryEnterPress" />
            </template>
            <template #content>
                <div ref="timeRangeSelector">
                    <TimeRangeSelector
                        :start="startTime"
                        :end="null"
                        @changed="updateTimeRange"
                        @close="closeAndFocusInput">
                    </TimeRangeSelector>
                </div>
            </template>
        </Dropdown>
    </div>
</template>

<style></style>
