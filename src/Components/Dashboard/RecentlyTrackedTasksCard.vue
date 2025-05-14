<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import RecentlyTrackedTasksCardEntry from '@/Components/Dashboard/RecentlyTrackedTasksCardEntry.vue';
import DashboardCard from '@/Components/Dashboard/DashboardCard.vue';
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';
import { router, route } from '@/utils/inertia';
import { useTimersStore } from '@/store/timers';
import { getCurrentMembershipId, getCurrentOrganizationId } from '@/utils/useUser';
import LoadingSpinner from '@/Components/src/LoadingSpinner.vue';

const { timers, isLoading } = storeToRefs(useTimersStore());

const organizationId = computed(() => getCurrentOrganizationId());

const latestTimers = computed(() => {
	const noDuplicates = [];
	for (let index = 0; index < timers.value.length; index++) {
		if (!timers.value[index].chapitre_id && !timers.value[index].module_id) continue;
		if (noDuplicates.some((it) => it.chapitre_id === timers.value[index].chapitre_id)) continue;
		noDuplicates.push(timers.value[index]);
		if (noDuplicates.length > 3) break;
	}
	return noDuplicates;
});
</script>

<template>
	<DashboardCard title="Recent Time Entries" :icon="CheckCircleIcon">
		<div v-if="isLoading" class="flex justify-center items-center h-40">
			<LoadingSpinner />
		</div>
		<div v-else-if="latestTimers && latestTimers.length > 0">
			<RecentlyTrackedTasksCardEntry
				v-for="timer in latestTimers"
				:key="timer.id"
				:time-entry="timer"
				:class="latestTimers.length === 4 ? 'last:border-0' : ''"
			></RecentlyTrackedTasksCardEntry>
		</div>
		<div v-else class="text-center flex flex-1 justify-center items-center">
			<div>
				<PlusCircleIcon class="w-8 text-icon-default inline pb-2"></PlusCircleIcon>
				<h3 class="text-text-primary font-semibold text-sm">Aucune tache créer</h3>
				<p class="pb-5 text-sm">Créer une tache pour un module!</p>
				<SecondaryButton @click="router.visit(route('projects'))">Modules</SecondaryButton>
			</div>
		</div>
		<div v-if="timers && timers.length === 1" class="text-center flex flex-1 justify-center items-center text-sm">
			<div>
				<PlusCircleIcon class="w-8 text-icon-default inline pb-2"></PlusCircleIcon>
				<h3 class="text-text-primary font-semibold">Add more tasks</h3>
				<p class="pb-5">Créer une tache pour un module!</p>
				<SecondaryButton @click="router.visit(route('projects'))">Modules</SecondaryButton>
			</div>
		</div>
	</DashboardCard>
</template>
