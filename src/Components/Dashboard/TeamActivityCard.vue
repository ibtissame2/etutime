<script setup>
import { UserGroupIcon } from '@heroicons/vue/20/solid';
import DashboardCard from '@/Components/Dashboard/DashboardCard.vue';
import TeamActivityCardEntry from '@/Components/Dashboard/TeamActivityCardEntry.vue';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';

const latestTeamActivity = [
	{
		time_entry_id: '1',
		name: 'time 1',
		description: 'Hello',
		status: true,
		task_id: '1',
		project_id: '1',
		tags: [],
	},
	{
		time_entry_id: '2',
		name: 'time 2',
		description: 'Hello 2',
		status: false,
		task_id: '2',
		project_id: '2',
		tags: [],
	},
];
</script>

<template>
	<DashboardCard title="Team Activity" :icon="UserGroupIcon">
		<div v-if="latestTeamActivity">
			<TeamActivityCardEntry
				v-for="activity in latestTeamActivity"
				:key="activity.time_entry_id"
				:class="latestTeamActivity.length === 4 ? 'last:border-0' : ''"
				:name="activity.name"
				:description="activity.description"
				:working="activity.status"
			></TeamActivityCardEntry>
		</div>
		<div v-else class="text-center text-gray-500 py-8">No team activity found</div>
		<div
			v-if="latestTeamActivity && latestTeamActivity.length <= 1"
			class="text-center flex flex-1 justify-center items-center"
		>
			<div>
				<UserGroupIcon class="w-8 text-icon-default inline pb-2"></UserGroupIcon>
				<h3 class="text-text-primary font-semibold text-sm">Invite your co-workers</h3>
				<p class="pb-5 text-sm">You can invite your entire team.</p>
				<SecondaryButton>Go to Members (Ibtissame)</SecondaryButton>
			</div>
		</div>
	</DashboardCard>
</template>
