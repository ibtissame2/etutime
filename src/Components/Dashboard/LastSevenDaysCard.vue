<script setup>
import { CalendarIcon } from '@heroicons/vue/20/solid';
import DashboardCard from '@/Components/Dashboard/DashboardCard.vue';
import DayOverviewCardEntry from '@/Components/Dashboard/DayOverviewCardEntry.vue';

const last7Days = [
	{ date: '2025-04-21', duration: 50, history: [1] },
	{ date: '2025-04-20', duration: 50, history: [1] },
	{ date: '2025-04-19', duration: 50, history: [1] },
	{ date: '2025-04-18', duration: 3650, history: [1] },
	{ date: '2025-04-17', duration: 93, history: [1, 2, 3] },
	{ date: '2025-04-16', duration: 93, history: [1, 2, 3] },
	{ date: '2025-04-15', duration: 93, history: [1, 2, 3] },
];
</script>

<template>
	<DashboardCard title="Last 7 Days" :icon="CalendarIcon">
		<div v-if="last7Days">
			<DayOverviewCardEntry
				v-for="day in last7Days"
				:key="day.date"
				:class="last7Days.length === 7 ? 'last:border-0 first:pt-3' : ''"
				:date="day.date"
				:history="day.history"
				:duration="day.duration"
			></DayOverviewCardEntry>
		</div>
		<div v-else class="text-center text-gray-500 py-8">No data available</div>
	</DashboardCard>
</template>
