<script setup>
import VChart from 'vue-echarts';
import { computed, ref } from 'vue';

const props = defineProps({
	history: Array,
});

const seriesData = computed(() =>
	props.history.map((el) => {
		return {
			value: el,
			itemStyle: {
				borderWidth: 1,
				borderColor: 'rgba(56,189,248,0.8)',
				color: 'rgba(56,189,248,0.8)',
				borderRadius: [2, 2, 0, 0],
			},
		};
	})
);

const option = ref({
	grid: {
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
	},
	backgroundColor: 'transparent',
	xAxis: {
		type: 'category',
		data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		markLine: {
			lineStyle: {
				color: 'rgba(125,156,188,0.1)',
				type: 'dashed',
			},
		},
		axisLine: {
			lineStyle: { color: 'transparent' },
		},
		axisLabel: {
			fontSize: 16,
			fontWeight: 600,
			margin: 24,
			fontFamily: 'Outfit, sans-serif',
		},
		axisTick: {
			lineStyle: { color: 'transparent' },
		},
	},
	yAxis: {
		type: 'value',
		splitLine: {
			lineStyle: { color: 'transparent' },
		},
	},
	series: [
		{
			data: seriesData,
			type: 'bar',
		},
	],
});
</script>

<template>
	<v-chart style="height: 20px; width: 80px" class="chart" :option="option" />
</template>
