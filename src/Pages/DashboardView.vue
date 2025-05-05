<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import TimeTracker from '@/Components/TimeTracker.vue';
import RecentlyTrackedTasksCard from '@/Components/Dashboard/RecentlyTrackedTasksCard.vue';
import LastSevenDaysCard from '@/Components/Dashboard/LastSevenDaysCard.vue';
import TeamActivityCard from '@/Components/Dashboard/TeamActivityCard.vue';
import ThisWeekOverview from '@/Components/Dashboard/ThisWeekOverview.vue';
import ActivityGraphCard from '@/Components/Dashboard/ActivityGraphCard.vue';
import MainContainer from '@/Components/src/MainContainer.vue';
import { useQueryClient } from '@/utils/tanstack';

const queryClient = useQueryClient();

const refreshDashboardData = () => {
	queryClient.invalidateQueries({ queryKey: ['latestTasks'] });
	queryClient.invalidateQueries({ queryKey: ['lastSevenDays'] });
	queryClient.invalidateQueries({ queryKey: ['dailyTrackedHours'] });
	queryClient.invalidateQueries({ queryKey: ['latestTeamActivity'] });
	queryClient.invalidateQueries({ queryKey: ['weeklyProjectOverview'] });
	queryClient.invalidateQueries({ queryKey: ['totalWeeklyTime'] });
	queryClient.invalidateQueries({ queryKey: ['weeklyHistory'] });
	queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
};
</script>

<template>
	<AppLayout title="Dashboard" data-testid="dashboard_view">
		<MainContainer class="pt-5 sm:pt-8 pb-4 sm:pb-6 border-b border-default-background-separator">
			<TimeTracker @change="refreshDashboardData"></TimeTracker>
		</MainContainer>

		<MainContainer
			class="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-3 sm:pt-5 pb-4 sm:pb-6 border-b border-default-background-separator items-stretch"
		>
			<RecentlyTrackedTasksCard></RecentlyTrackedTasksCard>
			<LastSevenDaysCard></LastSevenDaysCard>
			<ActivityGraphCard></ActivityGraphCard>
			<TeamActivityCard class="flex lg:hidden xl:flex"> </TeamActivityCard>
		</MainContainer>
		<MainContainer class="py-5">
			<ThisWeekOverview></ThisWeekOverview>
		</MainContainer>
	</AppLayout>
</template>
