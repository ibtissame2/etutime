<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMinuteursStore } from '@/store/minuteurs';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';
import { ClockIcon } from '@heroicons/vue/20/solid';
import CardTitle from '@/Components/src/CardTitle.vue';
import RapportChart from '@/Components/Rapport/RapportChart.vue';
import RapportPieChart from '@/Components/Rapport/RapportPieChart.vue';

const { minuteurs } = storeToRefs(useMinuteursStore());

const filteredMinuteurs = computed(() => {
	const start = dayjs().startOf('week').format('YYYY-MM-DD HH:mm:ss');
	const end = dayjs().endOf('week').format('YYYY-MM-DD HH:mm:ss');
	return minuteurs.value.filter((m) => m.end && m.start >= start && m.start <= end);
});

const totalWeeklyTime = computed(() => {
	let total = 0;
	filteredMinuteurs.value.forEach((minuteur) => (total = total + minuteur.duration));
	return total;
});
</script>

<template>
	<div class="grid space-y-5 sm:space-y-0 sm:gap-x-6 xl:gap-x-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
		<div class="col-span-2 xl:col-span-3">
			<CardTitle title="This Week" class="pb-8" :icon="ClockIcon"></CardTitle>
			<RapportChart :minuteurs="filteredMinuteurs" :is-this-week="true"></RapportChart>
		</div>
		<div class="space-y-6">
			<div class="rounded-lg bg-card-background border-card-border shadow-card border px-3.5 py-2.5">
				<dt class="font-semibold text-sm text-muted">Spent Time</dt>
				<dd class="text-2xl text-text-primary pt-1 font-semibold">
					{{ totalWeeklyTime ? formatHumanReadableDuration(totalWeeklyTime) : '--' }}
				</dd>
			</div>
			<RapportPieChart :minuteurs="filteredMinuteurs"></RapportPieChart>
		</div>
	</div>
</template>

<style scoped>
.chart {
	height: 280px;
	background: transparent;
}
</style>
