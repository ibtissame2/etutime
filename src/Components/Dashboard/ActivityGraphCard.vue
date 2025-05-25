<script setup>
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, computed } from 'vue';
import { use } from 'echarts/core';
import DashboardCard from '@/Components/Dashboard/DashboardCard.vue';
import { BoltIcon } from '@heroicons/vue/20/solid';
import { HeatmapChart } from 'echarts/charts';
import { CalendarComponent, TitleComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import dayjs from 'dayjs';
import { formatDate, formatHumanReadableDuration } from '@/Components/src/utils/time';
import { useCssVar } from '@vueuse/core';

use([TitleComponent, TooltipComponent, VisualMapComponent, CalendarComponent, HeatmapChart, CanvasRenderer]);

const dailyHoursTracked = ref([
	{ date: '2025-04-21', duration: 50, history: [1] },
	{ date: '2025-04-20', duration: 50, history: [1] },
	{ date: '2025-04-19', duration: 50, history: [1] },
	{ date: '2025-04-18', duration: 3650, history: [1] },
	{ date: '2025-04-17', duration: 93, history: [1, 2, 3] },
	{ date: '2025-04-16', duration: 93, history: [1, 2, 3] },
	{ date: '2025-04-15', duration: 93, history: [1, 2, 3] },
]);

provide(THEME_KEY, 'dark');

const max = computed(() => {
	return Math.max(Math.max(...dailyHoursTracked.value.map((el) => el.duration)), 1);
});

const backgroundColor = useCssVar('--color-card-background', null, { observe: true });
const itemBackgroundColor = useCssVar('--color-bg-tertiary', null, { observe: true });

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
			inRange: {
				color: [itemBackgroundColor.value, '#2DBE45'],
			},
			show: false,
		},
		calendar: {
			top: 40,
			bottom: 20,
			left: 40,
			right: 10,
			cellSize: [40, 40],
			dayLabel: { firstDay: 'monday' },
			splitLine: { show: false },
			range: [dayjs().format('YYYY-MM-DD'), dayjs().subtract(50, 'day').startOf('week').format('YYYY-MM-DD')],
			itemStyle: {
				color: 'transparent',
				borderWidth: 8,
				borderColor: backgroundColor.value,
			},
			yearLabel: { show: false },
		},
		series: {
			type: 'heatmap',
			coordinateSystem: 'calendar',
			data: dailyHoursTracked.value.map((el) => [el.date, el.duration]) ?? [],
			itemStyle: {
				borderRadius: 5,
				borderColor: 'rgba(255,255,255,0.05)',
				borderWidth: 1,
			},
			tooltip: {
				valueFormatter: (value, dataIndex) => {
					if (dailyHoursTracked.value.length) {
						return formatDate(dailyHoursTracked.value[dataIndex].date) + ': ' + formatHumanReadableDuration(value);
					} else {
						return '';
					}
				},
			},
		},
		backgroundColor: 'transparent',
	};
});
</script>

<template>
	<DashboardCard title="Activity Graph" :icon="BoltIcon">
		<div class="px-2">
			<div v-if="dailyHoursTracked">
				<v-chart
					class="chart"
					:autoresize="true"
					:option="option"
					style="height: 260px; background-color: transparent"
				/>
			</div>
			<div v-else class="text-center text-gray-500 py-8">No activity data available</div>
		</div>
	</DashboardCard>
</template>

<style></style>
