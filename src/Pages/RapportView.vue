<script setup>
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';
import { useRapportStore } from '@/store/rapport';
import { useModulesStore } from '@/store/modules';
import { useMinuteursStore } from '@/store/minuteurs';
import { FolderIcon, ChartBarIcon } from '@heroicons/vue/20/solid';
import MainContainer from '@/Components/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageTitle from '@/Components/Common/PageTitle.vue';
import RapportExportModal from '@/Components/Rapport/RapportExportModal.vue';
import DateRangePicker from '@/Components/src/Input/DateRangePicker.vue';
import RapportChart from '@/Components/Rapport/RapportChart.vue';
import RapportFilterBadge from '@/Components/Rapport/RapportFilterBadge.vue';
import ModuleMultiselectDropdown from '@/Components/Module/ModuleMultiselectDropdown.vue';
import RapportGroupBySelect from '@/Components/Rapport/RapportGroupBySelect.vue';
import RapportRow from '@/Components/Rapport/RapportRow.vue';
import RapportPieChart from '@/Components/Rapport/RapportPieChart.vue';

const { getNameForRapportRowEntry, emptyPlaceholder, groupByOptions } = useRapportStore();
const { aggregatedTableTimeEntries } = storeToRefs(useRapportStore());
const { modules } = storeToRefs(useModulesStore());
const { minuteurs } = storeToRefs(useMinuteursStore());

const startDate = ref(dayjs().subtract(14, 'd').format('YYYY-MM-DD'));
const endDate = ref(dayjs().format('YYYY-MM-DD'));
const selectedModules = ref([]);
const showExportModal = ref(false);
const exportUrl = ref(null);

const range = computed(() => {
	return [
		dayjs(startDate.value).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
		dayjs(endDate.value).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
	];
});

const filteredMinuteurs = computed(() => {
	const modules = selectedModules.value;
	return minuteurs.value.filter((minuteur) => {
		if (!minuteur.end) return false;
		if (modules.length && !modules.includes(minuteur.module_id)) return false;
		return minuteur.start >= range.value[0] && minuteur.start <= range.value[1];
	});
});

const tableData = computed(() => {
	return [];
	return aggregatedTableTimeEntries.value?.grouped_data?.map((entry) => {
		return {
			seconds: entry.seconds,
			cost: entry.cost,
			description: getNameForRapportRowEntry(entry.key, aggregatedTableTimeEntries.value?.grouped_type),
			grouped_data:
				entry.grouped_data?.map((el) => {
					return {
						seconds: el.seconds,
						cost: el.cost,
						description: getNameForRapportRowEntry(el.key, entry.grouped_type),
					};
				}) ?? [],
		};
	});
});
</script>

<template>
	<AppLayout title="Rapport" class="overflow-hidden">
		<RapportExportModal v-model:show="showExportModal" :export-url="exportUrl"></RapportExportModal>
		<MainContainer class="py-3 sm:py-5 border-b border-default-background-separator flex justify-between items-center">
			<div class="flex items-center space-x-3 sm:space-x-6">
				<PageTitle :icon="ChartBarIcon" title="Rapport"></PageTitle>
				<ModuleMultiselectDropdown v-model="selectedModules">
					<template #trigger>
						<RapportFilterBadge
							:count="selectedModules.length"
							:active="selectedModules.length > 0"
							title="Module"
							:icon="FolderIcon"
						></RapportFilterBadge>
					</template>
				</ModuleMultiselectDropdown>
			</div>

			<DateRangePicker v-model:start="startDate" v-model:end="endDate" />
		</MainContainer>

		<MainContainer>
			<div class="pt-10 w-full px-3 relative">
				<RapportChart :minuteurs="filteredMinuteurs" :is-this-week="false" :range="range"></RapportChart>
			</div>
		</MainContainer>

		<MainContainer>
			<div class="sm:grid grid-cols-4 pt-6 items-start">
				<div class="col-span-3 bg-card-background rounded-lg border border-card-border pt-3">
					<div
						class="text-sm flex text-text-primary items-center space-x-3 font-medium px-6 border-b border-card-background-separator pb-3"
					>
						<span>Grouper par</span>
						<RapportGroupBySelect
							v-model="group"
							:group-by-options="groupByOptions"
						></RapportGroupBySelect>
						<span>et</span>
						<RapportGroupBySelect
							v-model="subGroup"
							:group-by-options="groupByOptions.filter((el) => el.value !== group)"
						></RapportGroupBySelect>
					</div>
					<div class="grid items-center" style="grid-template-columns: 1fr 100px 150px">
						<div
							class="contents [&>*]:border-card-background-separator [&>*]:border-b [&>*]:bg-tertiary [&>*]:pb-1.5 [&>*]:pt-1 text-muted text-sm"
						>
							<div class="pl-6">Nom</div>
							<div class="text-right">Durée</div>
							<div class="text-right pr-6">Coût</div>
						</div>
						<template
							v-if="aggregatedTableTimeEntries?.grouped_data && aggregatedTableTimeEntries.grouped_data?.length > 0"
						>
							<RapportRow
								v-for="entry in tableData"
								:key="entry.description ?? 'none'"
								:entry="entry"
								:type="aggregatedTableTimeEntries.grouped_type"
							></RapportRow>
							<div class="contents [&>*]:transition text-text-tertiary [&>*]:h-[50px]">
								<div class="flex items-center pl-6 font-medium">
									<span>Total</span>
								</div>
								<div class="justify-end flex items-center font-medium">
									{{ formatHumanReadableDuration(aggregatedTableTimeEntries.seconds) }}
								</div>
							</div>
						</template>
						<div v-else class="chart flex flex-col items-center justify-center py-12 col-span-3">
							<p class="text-lg text-text-primary font-semibold">Aucune minuteur trouvée</p>
							<p>Essayez de changer les filtres et la plage horaire</p>
						</div>
					</div>
				</div>
				<div class="px-2 lg:px-4">
					<RapportPieChart :minuteurs="filteredMinuteurs"></RapportPieChart>
				</div>
			</div>
		</MainContainer>
	</AppLayout>
</template>
