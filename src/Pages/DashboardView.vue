<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import TimeTracker from '@/Components/TimeTracker/TimeTracker.vue';
import RecentlyTrackedTasksCard from '@/Components/Dashboard/RecentlyTrackedTasksCard.vue';
import TeamActivityCard from '@/Components/Dashboard/TeamActivityCard.vue';
import ThisWeekOverview from '@/Components/Dashboard/ThisWeekOverview.vue';
import ActivityGraphCard from '@/Components/Dashboard/ActivityGraphCard.vue';
import MainContainer from '@/Components/src/MainContainer.vue';
</script>

<template>
	<AppLayout title="Accueil">
		<MainContainer class="pt-5 sm:pt-8 pb-4 sm:pb-6 border-b border-default-background-separator">
			<TimeTracker></TimeTracker>
		</MainContainer>

		<MainContainer
			class="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-3 pt-3 sm:pt-5 pb-4 sm:pb-6 border-b border-default-background-separator items-stretch"
		>
			<RecentlyTrackedTasksCard></RecentlyTrackedTasksCard>
			<ActivityGraphCard></ActivityGraphCard>
			<TeamActivityCard></TeamActivityCard>
		</MainContainer>

		<MainContainer class="py-5">
			<ThisWeekOverview></ThisWeekOverview>
		</MainContainer>
	</AppLayout>
</template>
