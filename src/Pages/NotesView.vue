<script setup>
import MainContainer from '@/packages/ui/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { TagIcon, PlusIcon } from '@heroicons/vue/16/solid';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import { ref } from 'vue';
import TagTable from '@/Components/Common/Tag/TagTable.vue';
// import TagCreateModal from '@/packages/ui/src/Tag/TagCreateModal.vue';
import PageTitle from '@/Components/Common/PageTitle.vue';
import { canCreateNotes } from '@/utils/permissions';
// import { useTagsStore } from '@/utils/useTags';

const showCreateNoteModal = ref(false);

async function createNote(tag) {
	// return await useTagsStore().createNote(tag);
}
</script>

<template>
	<AppLayout title="Notes" data-testid="notes_view">
		<MainContainer class="py-5 border-b border-default-background-separator flex justify-between items-center">
			<div class="flex items-center space-x-6">
				<PageTitle :icon="TagIcon" title="Notes"></PageTitle>
			</div>
			<SecondaryButton v-if="canCreateNotes()" :icon="PlusIcon" @click="showCreateNoteModal = true"
				>Créer une note
			</SecondaryButton>
			<!-- <TagCreateModal v-model:show="showCreateNoteModal" :create-tag="createNote"></TagCreateModal> -->
		</MainContainer>
		<!-- <TagTable :create-tag="createNote"></TagTable> -->
	</AppLayout>
</template>
