<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMinuteursStore } from '@/store/minuteurs';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';
import { ClockIcon } from '@heroicons/vue/20/solid';
import StatCard from '@/Components/Common/StatCard.vue';
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
			<StatCard title="Spent Time" :value="totalWeeklyTime ? formatHumanReadableDuration(totalWeeklyTime) : '--'" />
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
