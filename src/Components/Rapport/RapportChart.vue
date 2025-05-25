<script setup>
import dayjs from 'dayjs';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, computed, provide } from 'vue';
import { formatHumanReadableDuration, formatWeek } from '@/Components/src/utils/time';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';

use([BarChart, CanvasRenderer, GridComponent, LegendComponent, TitleComponent, TooltipComponent]);

provide(THEME_KEY, 'dark');

const props = defineProps({
	minuteurs: Array,
	range: { type: Array, default: undefined },
	isThisWeek: Boolean,
});

const weekdays = {
	lundi: 'Lun',
	mardi: 'Mar',
	mercredi: 'Mer',
	jeudi: 'Jeu',
	vendredi: 'Ven',
	samedi: 'Sam',
	dimanche: 'Dim',
};

const rangeDays = computed(() => {
	if (props.isThisWeek) return Object.values(weekdays);
	if (!Array.isArray(props.range) || props.range.length !== 2) return [];
	const start = dayjs(props.range[0]).startOf('day');
	const end = dayjs(props.range[1]).startOf('day');
	const days = [];
	let current = start;
	while (current.isSame(end) || current.isBefore(end)) {
		days.push(current.format('YYYY-MM-DD'));
		current = current.add(1, 'day');
	}
	return days;
});

const minuteursDayGroups = computed(() => {
	const groups = {};
	rangeDays.value.forEach((day) => (groups[day] = 0));
	for (const minuteur of props.minuteurs) {
		const formatedDate = props.isThisWeek
			? weekdays[dayjs(minuteur.start).format('dddd')]
			: dayjs(minuteur.start).format('YYYY-MM-DD');
		groups[formatedDate] = (groups[formatedDate] | 0) + minuteur.duration;
	}
	return Object.entries(groups);
});

const xAxisLabels = computed(() => {
	return minuteursDayGroups.value.map(([date]) => date);
});

const seriesData = computed(() => {
	const itemStyle = {
		borderColor: getGradiant(7, 5),
		emphasis: { color: getGradiant(9, 7) },
		borderRadius: [12, 12, 0, 0],
		color: getGradiant(7, 5),
	};
	return minuteursDayGroups.value.map(([_, duration]) => ({ value: duration, itemStyle }));
});

const option = computed(() => ({
	series: [{ data: seriesData.value, type: 'bar', tooltip: { valueFormatter: (v) => formatHumanReadableDuration(v) } }],
	tooltip: { trigger: 'item' },
	grid: { top: 0, right: 0, bottom: 50, left: 0 },
	backgroundColor: 'transparent',
	xAxis: {
		type: 'category',
		data: xAxisLabels.value,
		markLine: { lineStyle: { color: 'rgba(125,156,188,0.1)', type: 'dashed' } },
		axisLine: { lineStyle: { color: 'transparent' } },
		axisLabel: {
			fontSize: 12,
			fontWeight: 600,
			color: 'var(--color-text-secondary)',
			margin: 16,
			fontFamily: 'Outfit, sans-serif',
		},
		axisTick: { lineStyle: { color: 'transparent' } },
	},
	yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(125,156,188,0.2)' } } },
}));

const getGradiant = (start, end) => {
	return new LinearGradient(0, 0, 0, 1, [
		{ offset: 0, color: 'rgba(56,189,248,0.' + start + ')' },
		{ offset: 1, color: 'rgba(56,189,248,0.' + end + ')' },
	]);
};
</script>

<template>
	<div class="w-[calc(100%-1px)]">
		<v-chart v-if="seriesData.length > 0" :autoresize="true" class="chart" :option="option" />
		<div v-else class="chart flex flex-col items-center justify-center">
			<p class="text-lg text-text-primary font-semibold">Aucune minuteur trouvée</p>
			<p v-if="!isThisWeek">Essayez de changer les filtres et la plage horaire</p>
		</div>
	</div>
</template>

<style scoped>
.chart {
	height: 300px;
	background: transparent;
}
</style>
