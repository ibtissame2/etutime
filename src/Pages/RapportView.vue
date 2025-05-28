<script setup>
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';
import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
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
import RapportPieChart from '@/Components/Rapport/RapportPieChart.vue';

const { modules } = storeToRefs(useModulesStore());
const { chapitres } = storeToRefs(useChapitresStore());
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
	const list = selectedModules.value;
	return minuteurs.value.filter((minuteur) => {
		if (!minuteur.end) return false;
		if (list.length && !list.includes(minuteur.module_id)) return false;
		return minuteur.start >= range.value[0] && minuteur.start <= range.value[1];
	});
});

const tableData = computed(() => {
	const list = [];
	let duration = 0;
	filteredMinuteurs.value.forEach((minuteur) => {
		const chapitre = list.find((ch) => ch.id === (minuteur.chapitre_id || null));
		if (!chapitre) {
			const ch = minuteur.chapitre_id ? chapitres.value.find((ch) => ch.id === minuteur.chapitre_id) : { id: null };
			const module = modules.value.find((module) => module.id === minuteur.module_id);
			list.push({
				id: ch.id,
				name: ch.id ? ch.name || '' : null,
				module: module ? module.name || '' : null,
				duration: minuteur.duration,
			});
		} else chapitre.duration += minuteur.duration;
		duration += minuteur.duration;
	});
	return { list, duration };
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
				<div class="col-span-3 bg-card-background rounded-lg border border-card-border overflow-hidden">
					<div class="grid-container">
						<div
							class="contents [&>*]:border-card-background-separator [&>*]:border-b [&>*]:bg-tertiary [&>*]:pb-1.5 [&>*]:pt-1 text-muted text-sm"
						>
							<div><span>Nom</span></div>
							<div><span>Module</span></div>
							<div><span>Durée</span></div>
						</div>
						<template v-if="tableData.list.length > 0">
							<div
								v-for="chapitre in tableData.list"
								:key="chapitre.id"
								class="contents text-text-primary [&>*]:transition [&>*]:border-card-background-separator [&>*]:border-b [&>*]:h-[50px]"
							>
								<div class="font-medium space-x-3">
									<span>{{ chapitre.name === null ? 'Aucun chapitre' : chapitre.name }}</span>
								</div>
								<div class="font-medium space-x-3">
									<span>{{ chapitre.module === null ? 'Aucun module' : chapitre.module }}</span>
								</div>
								<div class="">
									<span>{{ formatHumanReadableDuration(chapitre.duration) }}</span>
								</div>
							</div>
							<div class="contents [&>*]:transition text-text-tertiary [&>*]:h-[50px]">
								<div class="font-medium"><span>Total</span></div>
								<div></div>
								<div class="font-medium">
									<span>{{ formatHumanReadableDuration(tableData.duration) }}</span>
								</div>
							</div>
						</template>
						<div v-else class="is-empty chart flex flex-col items-center justify-center py-12 col-span-3">
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

<style scoped>
.grid-container > *:not(.is-empty) {
	display: grid;
	align-items: center;
	grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr) minmax(0, 126px);
}

.grid-container > * > * {
	display: flex;
	align-content: center;
	flex-wrap: wrap;
}

.grid-container > * > :first-child {
	padding-left: 1.5rem /* 24px */;
}

.grid-container > * > :last-child {
	padding-right: 1.5rem /* 24px */;
}

.grid-container span {
	height: fit-content;
}
</style>
