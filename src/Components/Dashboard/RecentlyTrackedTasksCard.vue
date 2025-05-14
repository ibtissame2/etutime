<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import RecentlyTrackedTasksCardEntry from '@/Components/Dashboard/RecentlyTrackedTasksCardEntry.vue';
import DashboardCard from '@/Components/Dashboard/DashboardCard.vue';
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import { useMinuteursStore } from '@/store/minuteurs';
import LoadingSpinner from '@/Components/src/LoadingSpinner.vue';

const { minuteurs, isLoading } = storeToRefs(useMinuteursStore());

const latestMinuteurs = computed(() => {
	const noDuplicates = [];
	const list = [...minuteurs.value];
	for (let index = 0; index < list.length; index++) {
		if (noDuplicates.some((it) => it.chapitre_id === list[index].chapitre_id)) continue;
		noDuplicates.push(list[index]);
		if (noDuplicates.length > 3) break;
	}
	return noDuplicates;
});
</script>

<template>
	<DashboardCard title="Minuteurs récentes" :icon="CheckCircleIcon">
		<div v-if="isLoading" class="flex justify-center items-center h-40">
			<LoadingSpinner />
		</div>
		<div v-else-if="latestMinuteurs && latestMinuteurs.length > 0">
			<RecentlyTrackedTasksCardEntry
				v-for="timer in latestMinuteurs"
				:key="timer.id"
				:time-entry="timer"
				:class="latestMinuteurs.length === 4 ? 'last:border-0' : ''"
			></RecentlyTrackedTasksCardEntry>
		</div>
		<div v-else class="text-center flex flex-1 justify-center items-center">
			<div>
				<h3 class="text-text-primary font-semibold text-sm">Aucune minuteur créer</h3>
				<p class="pb-5 max-w-md mx-auto text-sm pt-1">Créer votre premier minuteur</p>
			</div>
		</div>
	</DashboardCard>
</template>
