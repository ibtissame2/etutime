<script setup>
import MainContainer from '@/Components/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { ArrowsRightLeftIcon } from '@heroicons/vue/16/solid';
import PageTitle from '@/Components/Common/PageTitle.vue';
import ImportData from '@/Components/documents/ImportData.vue';
</script>

<template>
	<AppLayout title="Import / Export" data-testid="import_view">
		<MainContainer class="py-5 border-b border-default-background-separator flex justify-between items-center">
			<div class="flex items-center space-x-6">
				<PageTitle :icon="ArrowsRightLeftIcon" title="Import / Export"> </PageTitle>
			</div>
		</MainContainer>
		<MainContainer class="py-6 space-y-4">
			<ImportData></ImportData>
		</MainContainer>
	</AppLayout>
</template>
