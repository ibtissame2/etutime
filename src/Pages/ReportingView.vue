<script setup>
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import MainContainer from '@/Components/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { FolderIcon, ChartBarIcon, UserGroupIcon, CheckCircleIcon, TagIcon } from '@heroicons/vue/20/solid';
import PageTitle from '@/Components/Common/PageTitle.vue';
import DateRangePicker from '@/Components/src/Input/DateRangePicker.vue';
import ReportingChart from '@/Components/Common/Reporting/ReportingChart.vue';
import { computed, onMounted, ref } from 'vue';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';
import { useReportingStore } from '@/utils/useReporting';
import TagDropdown from '@/Components/Common/Tag/TagDropdown.vue';
import ReportingFilterBadge from '@/Components/Common/Reporting/ReportingFilterBadge.vue';
import ModuleMultiselectDropdown from '@/Components/Module/ModuleMultiselectDropdown.vue';
import MemberMultiselectDropdown from '@/Components/Common/Member/MemberMultiselectDropdown.vue';
import ChapitreMultiselectDropdown from '@/Components/Chapitre/ChapitreMultiselectDropdown.vue';
import ReportingGroupBySelect from '@/Components/Common/Reporting/ReportingGroupBySelect.vue';
import ReportingRow from '@/Components/Common/Reporting/ReportingRow.vue';
import ReportingPieChart from '@/Components/Common/Reporting/ReportingPieChart.vue';
import { getCurrentMembershipId, getCurrentOrganizationId, getCurrentRole } from '@/utils/useUser';
import { useTachesStore } from '@/store/taches';
import { useSessionStorage, useStorage } from '@vueuse/core';
import { useNotificationsStore } from '@/utils/notification';
import { getRandomColorWithSeed } from '@/Components/src/utils/color';

const { handleApiRequestNotifications } = useNotificationsStore();

const startDate = useSessionStorage('reporting-start-date', dayjs().subtract(14, 'd').format('YYYY-MM-DD HH:mm:ss'));
const endDate = useSessionStorage('reporting-end-date', dayjs().format('YYYY-MM-DD HH:mm:ss'));

const selectedTags = ref([]);
const selectedProjects = ref([]);
const selectedMembers = ref([]);
const selectedTasks = ref([]);

const group = useStorage('reporting-group', 'project');
const subGroup = useStorage('reporting-sub-group', 'task');

const reportingStore = useReportingStore();
const { aggregatedGraphTimeEntries, aggregatedTableTimeEntries } = storeToRefs(reportingStore);
const { groupByOptions } = reportingStore;

function getFilterAttributes() {
	return {
		start: dayjs(startDate.value).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
		end: dayjs(endDate.value).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
		member_ids: selectedMembers.value.length > 0 ? selectedMembers.value : undefined,
		project_ids: selectedProjects.value.length > 0 ? selectedProjects.value : undefined,
		task_ids: selectedTasks.value.length > 0 ? selectedTasks.value : undefined,
		tag_ids: selectedTags.value.length > 0 ? selectedTags.value : undefined,
	};
}

function updateGraphReporting() {
	const params = getFilterAttributes();
	if (getCurrentRole() === 'employee') {
		params.member_id = getCurrentMembershipId();
	}
	params.fill_gaps_in_time_groups = 'true';
	params.group = getOptimalGroupingOption(startDate.value, endDate.value);
	useReportingStore().fetchGraphReporting(params);
}

function updateTableReporting() {
	const params = getFilterAttributes();
	if (group.value === subGroup.value) {
		const fallbackOption = groupByOptions.find((el) => el.value !== group.value);
		if (fallbackOption?.value) {
			subGroup.value = fallbackOption.value;
		}
	}
	if (getCurrentRole() === 'employee') {
		params.member_id = getCurrentMembershipId();
	}
	params.group = group.value;
	params.sub_group = subGroup.value;
	useReportingStore().fetchTableReporting(params);
}

function updateReporting() {
	updateGraphReporting();
	updateTableReporting();
}

function getOptimalGroupingOption(startDate, endDate) {
	const diffInDays = dayjs(endDate).diff(dayjs(startDate), 'd');

	if (diffInDays <= 31) {
		return 'day';
	} else if (diffInDays <= 200) {
		return 'week';
	} else {
		return 'month';
	}
}

onMounted(() => {
	updateGraphReporting();
	updateTableReporting();
});

const { taches } = storeToRefs(useTachesStore());

const reportProperties = computed(() => {
	return {
		...getFilterAttributes(),
		group: group.value,
		sub_group: subGroup.value,
		history_group: getOptimalGroupingOption(startDate.value, endDate.value),
	};
});

async function downloadExport(format) {
	const organizationId = getCurrentOrganizationId();
	if (organizationId) {
		const response = await handleApiRequestNotifications(
			() =>
				api.exportAggregatedTimeEntries({
					params: {
						organization: organizationId,
					},
					queries: {
						...getFilterAttributes(),
						group: group.value,
						sub_group: subGroup.value,
						history_group: getOptimalGroupingOption(startDate.value, endDate.value),
						format: format,
					},
				}),
			'Export successful',
			'Export failed'
		);

		if (response?.download_url) {
			showExportModal.value = true;
			exportUrl.value = response.download_url;
		}
	}
}

const { getNameForReportingRowEntry, emptyPlaceholder } = useReportingStore();
import { useModulesStore } from '@/store/modules';
import ReportingExportModal from '@/Components/Common/Reporting/ReportingExportModal.vue';
const { modules } = storeToRefs(useModulesStore());
const showExportModal = ref(false);
const exportUrl = ref(null);

const groupedPieChartData = computed(() => {
	return (
		aggregatedTableTimeEntries.value?.grouped_data?.map((entry) => {
			const name = getNameForReportingRowEntry(entry.key, aggregatedTableTimeEntries.value?.grouped_type);
			let color = getRandomColorWithSeed(entry.key ?? 'none');
			if (
				name &&
				aggregatedTableTimeEntries.value?.grouped_type &&
				emptyPlaceholder[aggregatedTableTimeEntries.value?.grouped_type] === name
			) {
				color = '#CCCCCC';
			} else if (aggregatedTableTimeEntries.value?.grouped_type === 'project') {
				color = modules.value?.find((project) => project.id === entry.key)?.color ?? '#CCCCCC';
			}
			return {
				value: entry.seconds,
				name: getNameForReportingRowEntry(entry.key, aggregatedTableTimeEntries.value?.grouped_type) ?? '',
				color: color,
			};
		}) ?? []
	);
});

const tableData = computed(() => {
	return aggregatedTableTimeEntries.value?.grouped_data?.map((entry) => {
		return {
			seconds: entry.seconds,
			cost: entry.cost,
			description: getNameForReportingRowEntry(entry.key, aggregatedTableTimeEntries.value?.grouped_type),
			grouped_data:
				entry.grouped_data?.map((el) => {
					return {
						seconds: el.seconds,
						cost: el.cost,
						description: getNameForReportingRowEntry(el.key, entry.grouped_type),
					};
				}) ?? [],
		};
	});
});
</script>

<template>
	<AppLayout title="Reporting" data-testid="reporting_view" class="overflow-hidden">
		<ReportingExportModal v-model:show="showExportModal" :export-url="exportUrl"></ReportingExportModal>
		<MainContainer class="py-3 sm:py-5 border-b border-default-background-separator flex justify-between items-center">
			<div class="flex items-center space-x-3 sm:space-x-6">
				<PageTitle :icon="ChartBarIcon" title="Rapport"></PageTitle>
			</div>
		</MainContainer>
		<div class="py-2.5 w-full border-b border-default-background-separator">
			<MainContainer class="sm:flex space-y-4 sm:space-y-0 justify-between">
				<div class="flex flex-wrap items-center space-y-2 sm:space-y-0 space-x-4">
					<div class="text-sm font-medium">Filtres</div>

					<ModuleMultiselectDropdown v-model="selectedProjects" @submit="updateReporting">
						<template #trigger>
							<ReportingFilterBadge
								:count="selectedProjects.length"
								:active="selectedProjects.length > 0"
								title="Module"
								:icon="FolderIcon"
							></ReportingFilterBadge>
						</template>
					</ModuleMultiselectDropdown>
					<ChapitreMultiselectDropdown v-model="selectedTasks" @submit="updateReporting">
						<template #trigger>
							<ReportingFilterBadge
								:count="selectedTasks.length"
								:active="selectedTasks.length > 0"
								title="Chapitre"
								:icon="CheckCircleIcon"
							></ReportingFilterBadge>
						</template>
					</ChapitreMultiselectDropdown>

					<TagDropdown v-model="selectedTags" :taches="taches" @submit="updateReporting">
						<template #trigger>
							<ReportingFilterBadge
								:count="selectedTags.length"
								:active="selectedTags.length > 0"
								title="Taches"
								:icon="TagIcon"
							></ReportingFilterBadge>
						</template>
					</TagDropdown>
				</div>
				<div>
					<DateRangePicker v-model:start="startDate" v-model:end="endDate" @submit="updateReporting" />
				</div>
			</MainContainer>
		</div>
		<MainContainer>
			<div class="pt-10 w-full px-3 relative">
				<ReportingChart
					:grouped-type="aggregatedGraphTimeEntries?.grouped_type"
					:grouped-data="aggregatedGraphTimeEntries?.grouped_data"
				></ReportingChart>
			</div>
		</MainContainer>
		<MainContainer>
			<div class="sm:grid grid-cols-4 pt-6 items-start">
				<div class="col-span-3 bg-card-background rounded-lg border border-card-border pt-3">
					<div
						class="text-sm flex text-text-primary items-center space-x-3 font-medium px-6 border-b border-card-background-separator pb-3"
					>
						<span>Grouper par</span>
						<ReportingGroupBySelect
							v-model="group"
							:group-by-options="groupByOptions"
							@changed="updateTableReporting"
						></ReportingGroupBySelect>
						<span>et</span>
						<ReportingGroupBySelect
							v-model="subGroup"
							:group-by-options="groupByOptions.filter((el) => el.value !== group)"
							@changed="updateTableReporting"
						></ReportingGroupBySelect>
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
							<ReportingRow
								v-for="entry in tableData"
								:key="entry.description ?? 'none'"
								:entry="entry"
								:type="aggregatedTableTimeEntries.grouped_type"
							></ReportingRow>
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
					<ReportingPieChart :data="groupedPieChartData"></ReportingPieChart>
				</div>
			</div>
		</MainContainer>
	</AppLayout>
</template>
