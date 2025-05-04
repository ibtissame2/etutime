<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import DeleteTeamForm from '@/Pages/Teams/Partials/DeleteTeamForm.vue';
import SectionBorder from '@/Components/SectionBorder.vue';
import UpdateTeamNameForm from '@/Pages/Teams/Partials/UpdateTeamNameForm.vue';

defineProps({
	team: Object,
	availableRoles: Array,
});
</script>

<template>
	<AppLayout title="Organization Settings">
		<template #header>
			<h2 class="font-semibold text-xl text-text-primary leading-tight">Organization Settings</h2>
		</template>

		<div>
			<div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
				<UpdateTeamNameForm :team="team" />

				<SectionBorder />
				<SectionBorder />

				<template>
					<DeleteTeamForm class="mt-10 sm:mt-0" :team="team" />
				</template>
			</div>
		</div>
	</AppLayout>
</template>
