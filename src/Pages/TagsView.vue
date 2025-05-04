<script setup>
import MainContainer from '@/packages/ui/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { TagIcon, PlusIcon } from '@heroicons/vue/16/solid';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import { ref } from 'vue';
import TagTable from '@/Components/Common/Tag/TagTable.vue';
import TagCreateModal from '@/packages/ui/src/Tag/TagCreateModal.vue';
import PageTitle from '@/Components/Common/PageTitle.vue';

const showCreateTagModal = ref(false);
</script>

<template>
	<AppLayout title="Tâches" data-testid="tags_view">
		<MainContainer class="py-5 border-b border-default-background-separator flex justify-between items-center">
			<div class="flex items-center space-x-6">
				<PageTitle :icon="TagIcon" title="Tâches"></PageTitle>
			</div>
			<SecondaryButton :icon="PlusIcon" @click="showCreateTagModal = true">Créer une tâche </SecondaryButton>
			<TagCreateModal v-model:show="showCreateTagModal"></TagCreateModal>
		</MainContainer>
		<TagTable></TagTable>
	</AppLayout>
</template>
