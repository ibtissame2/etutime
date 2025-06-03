<script setup>
import dayjs from 'dayjs';
import VChart, { THEME_KEY } from 'vue-echarts';
import { provide, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMinuteursStore } from '@/Store/minuteurs';
import { formatDate, formatHumanReadableDuration } from '@/Components/src/utils/time';
import { use } from 'echarts/core';
import { HeatmapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { CalendarComponent, TitleComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { BoltIcon } from '@heroicons/vue/20/solid';
import DashboardCard from '@/Components/Dashboard/DashboardCard.vue';

use([TitleComponent, TooltipComponent, VisualMapComponent, CalendarComponent, HeatmapChart, CanvasRenderer]);

provide(THEME_KEY, 'dark');

const { minuteurs } = storeToRefs(useMinuteursStore());

const range = computed(() => {
	const end = dayjs();
	const start = end.subtract(30, 'day').startOf('week');
	return [
		[end.endOf('day').format('YYYY-MM-DD HH:mm:ss'), start.startOf('day').format('YYYY-MM-DD HH:mm:ss')],
		[end.format('YYYY-MM-DD'), start.format('YYYY-MM-DD')],
	];
});

const filteredMinuteurs = computed(() => {
	const list = [];
	for (const minuteur of minuteurs.value) {
		if (minuteur.end && minuteur.start >= range.value[0][1] && minuteur.start <= range.value[0][0]) {
			const date = dayjs(minuteur.start).format('YYYY-MM-DD');
			const entry = list.find((e) => e[0] === date);
			if (!entry) list.push([date, minuteur.duration]);
			else entry[1] += minuteur.duration;
		}
	}
	return list;
});

const max = computed(() => {
	return Math.max(1, ...filteredMinuteurs.value.map(([_, duration]) => duration));
});

const option = computed(() => {
	return {
		tooltip: {},
		visualMap: {
			min: 0,
			max: max.value,
			type: 'piecewise',
			orient: 'horizontal',
			left: 'center',
			top: 'center',
			inRange: { color: ['#2a2c32', '#2DBE45'] },
			show: false,
		},
		calendar: {
			top: 40,
			bottom: 20,
			left: 40,
			right: 10,
			cellSize: [40, 40],
			splitLine: { show: false },
			range: range.value[1],
			itemStyle: { color: 'transparent', borderWidth: 1, borderColor: '#2a2c32' },
			yearLabel: { show: false },
		},
		series: {
			type: 'heatmap',
			coordinateSystem: 'calendar',
			data: filteredMinuteurs.value,
			itemStyle: { borderRadius: 5, borderColor: 'rgba(255,255,255,0.05)', borderWidth: 1 },
			tooltip: {
				valueFormatter: (value, dataIndex) => {
					if (!filteredMinuteurs.value.length) return '';
					return formatDate(filteredMinuteurs.value[dataIndex][0]) + ': ' + formatHumanReadableDuration(value);
				},
			},
		},
		backgroundColor: 'transparent',
	};
});
</script>

<template>
	<DashboardCard title="Graphique d'activité" :icon="BoltIcon">
		<div class="px-2">
			<div v-if="filteredMinuteurs.length">
				<v-chart
					class="chart"
					:autoresize="true"
					:option="option"
					style="height: 260px; background-color: transparent"
				/>
			</div>
			<div v-else class="text-center flex flex-1 justify-center items-center">
				<div class="text-center text-gray-500 py-8">Aucune donnée d'activité<br />disponible</div>
			</div>
		</div>
	</DashboardCard>
</template>
