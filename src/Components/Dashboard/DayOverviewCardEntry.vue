<script setup>
import { formatHumanReadableDate, formatHumanReadableDuration } from '@/Components/src/utils/time';
import DayOverviewCardChart from '@/Components/Dashboard/DayOverviewCardChart.vue';

defineProps({
	date: String,
	duration: Number,
	history: Array,
});
</script>

<template>
	<div class="px-3.5 py-2 flex justify-between @container border-b border-card-background-separator">
		<div class="flex items-center min-w-[70px]">
			<p class="font-semibold text-sm text-text-primary">
				{{ formatHumanReadableDate(date) }}
			</p>
		</div>
		<div class="items-center justify-center flex-1 hidden @2xs:flex">
			<DayOverviewCardChart :history="history"></DayOverviewCardChart>
		</div>
		<div class="flex text-sm items-center justify-center text-muted min-w-[65px] font-semibold">
			{{ formatHumanReadableDuration(duration) }}
		</div>
	</div>
</template>
