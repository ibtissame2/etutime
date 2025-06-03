<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useEnvStore } from '@/store/env';
import { UserGroupIcon } from '@heroicons/vue/20/solid';
import DashboardCard from '@/Components/Dashboard/DashboardCard.vue';
import TeamActivityCardEntry from '@/Components/Dashboard/TeamActivityCardEntry.vue';

const { participants } = storeToRefs(useEnvStore());
const { loadStudyData } = useEnvStore();

const checkInterval = ref(null);

const sortedParticipants = computed(() => {
	const sorted = participants.value.toSorted((a, b) => (b.duration_week > a.duration_week ? 1 : -1));
	const index = sorted.findIndex((p) => p.current_user);
	return { three: sorted.slice(0, 3), current: { obj: index !== -1 ? sorted[index] : null, index } };
});

onMounted(() => {
	loadStudyData();
	checkInterval.value = setInterval(loadStudyData, 1000);
});

onBeforeUnmount(() => {
	clearInterval(checkInterval.value);
});
</script>

<template>
	<DashboardCard title="Activité d'équipe" :icon="UserGroupIcon">
		<div v-if="participants.length">
			<TeamActivityCardEntry
				v-for="(participant, index) in sortedParticipants.three"
				class="border-b last:border-b-0"
				:key="participant.id"
				:order="index"
				:is-current="participant.current_user"
				:name="participant.name"
				:duration="participant.duration_week"
				:working="participant.is_active"
			></TeamActivityCardEntry>

			<div v-if="sortedParticipants.current.obj && sortedParticipants.current.index > 2" class="border-t mt-4 pt-4">
				<TeamActivityCardEntry
					class="border-t"
					:is-current="true"
					:order="sortedParticipants.current.index"
					:name="sortedParticipants.current.obj.name"
					:duration="sortedParticipants.current.obj.duration_week"
					:working="sortedParticipants.current.obj.is_active"
				></TeamActivityCardEntry>
			</div>
		</div>
		<div v-else class="text-center flex flex-1 justify-center items-center">
			<div class="text-center text-gray-500 py-8">Aucune donnée disponible</div>
		</div>
	</DashboardCard>
</template>
