<script setup>
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import { FolderPlusIcon } from '@heroicons/vue/24/solid';
import { PlusIcon } from '@heroicons/vue/16/solid';
import { computed, ref } from 'vue';
import ProjectCreateModal from '@/packages/ui/src/Project/ProjectCreateModal.vue';
import ProjectTableHeading from '@/Components/Common/Project/ProjectTableHeading.vue';
import ProjectTableRow from '@/Components/Common/Project/ProjectTableRow.vue';
import { useModulesStore } from '@/store/modules';
import { useClientsStore } from '@/utils/useClients';
import { storeToRefs } from 'pinia';

const props = defineProps({
	projects: {
		type: Array,
		required: true,
	},
});

const showCreateProjectModal = ref(false);

async function createProject(project) {
	return await useModulesStore().createModule(project);
}

async function createClient(client) {
	return await useClientsStore().createClient(client);
}

const { clients } = storeToRefs(useClientsStore());

const gridTemplate = computed(() => {
	return `grid-template-columns: minmax(300px, 1fr) minmax(140px, auto) minmax(130px, auto) minmax(120px, auto) 80px;`;
});
</script>

<template>
	<!-- :enable-estimated-time="isAllowedToPerformPremiumAction" -->
	<ProjectCreateModal
		v-model:show="showCreateProjectModal"
		:create-client="createClient"
		:clients="clients"
	></ProjectCreateModal>
	<div class="flow-root max-w-[100vw] overflow-x-auto">
		<div class="inline-block min-w-full align-middle">
			<div data-testid="project_table" class="grid min-w-full" :style="gridTemplate">
				<ProjectTableHeading></ProjectTableHeading>
				<div v-if="projects.length === 0" class="col-span-5 py-24 text-center">
					<FolderPlusIcon class="w-8 text-icon-default inline pb-2"></FolderPlusIcon>
					<h3 class="text-text-primary font-semibold">Aucun module trouvé</h3>
					<p class="pb-5 max-w-md mx-auto text-sm pt-1">Créez votre premier module maintenant !</p>
					<SecondaryButton :icon="PlusIcon" @click="showCreateProjectModal = true"
						>Créez votre premier module
					</SecondaryButton>
				</div>
				<template v-for="project in projects" :key="project.id">
					<ProjectTableRow :project="project"></ProjectTableRow>
				</template>
			</div>
		</div>
	</div>
</template>
