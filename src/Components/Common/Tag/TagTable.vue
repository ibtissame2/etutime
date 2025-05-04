<script setup>
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import { FolderPlusIcon } from '@heroicons/vue/24/solid';
import { PlusIcon } from '@heroicons/vue/16/solid';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTachesStore } from '@/store/taches';
import TagTableRow from '@/Components/Common/Tag/TagTableRow.vue';
import TagCreateModal from '@/packages/ui/src/Tag/TagCreateModal.vue';
import TagTableHeading from '@/Components/Common/Tag/TagTableHeading.vue';
import { canCreateTags } from '@/utils/permissions';

const { taches } = storeToRefs(useTachesStore());
const showCreateTagModal = ref(false);
</script>

<template>
	<TagCreateModal v-model:show="showCreateTagModal"></TagCreateModal>
	<div class="flow-root">
		<div class="inline-block min-w-full align-middle">
			<div data-testid="tag_table" class="grid min-w-full" style="grid-template-columns: 1fr 80px">
				<TagTableHeading></TagTableHeading>
				<div v-if="taches.length === 0" class="col-span-5 py-24 text-center">
					<FolderPlusIcon class="w-8 text-icon-default inline pb-2"></FolderPlusIcon>
					<h3 class="text-text-primary font-semibold">No taches found</h3>
					<p v-if="canCreateTags()" class="pb-5">Create your first tag now!</p>
					<SecondaryButton v-if="canCreateTags()" :icon="PlusIcon" @click="showCreateTagModal = true"
						>Create your First Tag</SecondaryButton
					>
				</div>
				<template v-for="tag in taches" :key="tag.id">
					<TagTableRow :tag="tag"></TagTableRow>
				</template>
			</div>
		</div>
	</div>
</template>
