<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import dayjs from 'dayjs';
import { useMinuteursStore } from '@/store/minuteurs';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';
import TimeTrackerStartStop from '@/Components/TimeTracker/TimeTrackerStartStop.vue';

const { currentMinuteur, clock } = storeToRefs(useMinuteursStore());
const { toggleStartStopMinuteur } = useMinuteursStore();

const currentTime = computed(() => {
	if (clock.value && currentMinuteur.value.start) {
		const diff = clock.value.diff(dayjs(currentMinuteur.value.start), 's');
		return formatHumanReadableDuration(diff);
	}
	return formatHumanReadableDuration(0);
});
</script>

<template>
	<div class="pt-3 pb-2.5 px-2 flex justify-between items-center relative">
		<div>
			<div class="text-muted font-extrabold text-xs">Minuteur actuelle</div>
			<div class="text-text-primary font-medium text-lg">
				{{ currentTime }}
			</div>
		</div>
		<TimeTrackerStartStop
			:active="!!currentMinuteur.start"
			size="base"
			@changed="(s) => toggleStartStopMinuteur(s, currentMinuteur)"
		></TimeTrackerStartStop>
	</div>
</template>
