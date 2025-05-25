<script setup>
import VChart, { THEME_KEY } from 'vue-echarts';
import { computed, provide } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';

use([CanvasRenderer, PieChart, TitleComponent, GridComponent, TooltipComponent, LegendComponent]);

provide(THEME_KEY, 'dark');

const props = defineProps({
	weeklyProjectOverview: Object,
});

const seriesData = (props.weeklyProjectOverview.value || props.weeklyProjectOverview).map((el) => {
	return {
		...el,
		itemStyle: { color: `${el.color}BB` },
		emphasis: { itemStyle: { color: `${el.color}` } },
	};
});

const option = computed(() => ({
	tooltip: {
		trigger: 'item',
	},
	legend: {
		bottom: 'bottom',
		top: '250px',
		textStyle: {
			color: 'var(--color-text-secondary)',
		},
	},
	backgroundColor: 'transparent',
	series: [
		{
			label: {
				show: false,
			},
			tooltip: {
				valueFormatter: (value) => {
					return formatHumanReadableDuration(value);
				},
			},
			data: seriesData,
			top: '-45%',
			radius: ['30%', '60%'],
			type: 'pie',
		},
	],
}));
</script>

<template>
	<v-chart class="h-[420px] max-w-[300px] mx-auto bg-transparent" :autoresize="true" :option="option" />
</template>
