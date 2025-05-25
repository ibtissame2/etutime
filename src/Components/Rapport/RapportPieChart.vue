<script setup>
import VChart, { THEME_KEY } from 'vue-echarts';
import { computed, provide } from 'vue';
import { storeToRefs } from 'pinia';
import { useModulesStore } from '@/store/modules';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';
import { getRandomColorWithSeed } from '@/Components/src/utils/color';

provide(THEME_KEY, 'dark');
use([CanvasRenderer, PieChart, TitleComponent, GridComponent, TooltipComponent, LegendComponent]);

const { modules } = storeToRefs(useModulesStore());

const props = defineProps({
	minuteurs: Array,
});

const seriesData = computed(() => {
	let list = {};
	props.minuteurs.forEach((minuteur) => {
		if (!minuteur.module_id) return;
		list[minuteur.module_id] = (list[minuteur.module_id] || 0) + minuteur.duration;
	});
	list = Object.entries(list).map(([module_id, duration]) => {
		const module = modules.value.find((m) => m.id == module_id);
		if (!module) return;
		const color = module.color || getRandomColorWithSeed();
		return {
			value: duration,
			name: module.name,
			itemStyle: { color: `${color}BB` },
			emphasis: { itemStyle: { color: `${color}` } },
		};
	});
	return list.filter(Boolean).sort((a, b) => a.duration < b.duration);
});

const option = computed(() => ({
	tooltip: { trigger: 'item' },
	legend: {
		show: true,
		top: '250px',
		textStyle: { color: 'var(--color-text-secondary)' },
	},
	backgroundColor: 'transparent',
	series: [
		{
			label: { show: false },
			tooltip: { valueFormatter: (value) => formatHumanReadableDuration(value) },
			data: seriesData.value,
			radius: ['30%', '60%'],
			top: '-45%',
			type: 'pie',
		},
	],
}));
</script>

<template>
	<v-chart class="background-transparent max-w-[300px] mx-auto h-[460px]" :autoresize="true" :option="option" />
</template>

<style scoped></style>
