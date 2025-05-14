<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import dayjs from 'dayjs';
import { useTimersStore } from '@/store/timers';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';
import TimeTrackerStartStop from '@/Components/TimeTracker/TimeTrackerStartStop.vue';
import { getCurrentOrganizationId } from '@/utils/useUser';

const { currentTimer, clock } = storeToRefs(useTimersStore());
const { setActiveState } = useTimersStore();

const currentTime = computed(() => {
	if (clock.value && currentTimer.value?.start) {
		const diff = clock.value.diff(dayjs(currentTimer.value.start), 's');
		return formatHumanReadableDuration(diff);
	}
	return formatHumanReadableDuration(0);
});
</script>

<template>
	<div class="pt-3 pb-2.5 px-2 flex justify-between items-center relative">
		<div>
			<div class="text-muted font-extrabold text-xs">Current Timer</div>
			<div class="text-text-primary font-medium text-lg">
				{{ currentTime }}
			</div>
		</div>
		<TimeTrackerStartStop
			:active="!!(currentTimer?.start && !currentTimer?.end)"
			size="base"
			@changed="(s) => setActiveState(s, currentTimer)"
		></TimeTrackerStartStop>
	</div>
</template>
