<script setup>
import MainContainer from '@/packages/ui/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { FolderIcon, PlusIcon } from '@heroicons/vue/16/solid';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import ProjectTable from '@/Components/Common/Project/ProjectTable.vue';
import { computed, onMounted, ref } from 'vue';
import { useModulesStore } from '@/store/modules';
import ProjectCreateModal from '@/packages/ui/src/Project/ProjectCreateModal.vue';
import PageTitle from '@/Components/Common/PageTitle.vue';
import TabBarItem from '@/Components/Common/TabBar/TabBarItem.vue';
import TabBar from '@/Components/Common/TabBar/TabBar.vue';
import { storeToRefs } from 'pinia';
import { useClientsStore } from '@/utils/useClients';
import { useOrganizationStore } from '@/utils/useOrganization';

const { fetchModules, createModule } = useModulesStore();
const { modules } = storeToRefs(useModulesStore());

onMounted(() => {
	fetchModules();
	useOrganizationStore().fetchOrganization();
});

const { clients } = storeToRefs(useClientsStore());
const showCreateProjectModal = ref(false);
const activeTab = ref('active');

function isActiveTab(tab) {
	return activeTab.value === tab;
}

const shownModules = computed(() => {
	if (activeTab.value !== 'archived') return modules.value.filter((module) => module.is_public);
	return modules.value.filter((module) => !module.is_public);
});

async function createClient(client) {
	return await useClientsStore().createClient(client);
}
</script>

<template>
	<AppLayout title="Modules" data-testid="projects_view">
		<MainContainer class="py-3 sm:py-5 border-b border-default-background-separator flex justify-between items-center">
			<div class="flex items-center space-x-3 sm:space-x-6">
				<PageTitle :icon="FolderIcon" title="Modules"></PageTitle>
				<TabBar>
					<TabBarItem :active="isActiveTab('active')" @click="activeTab = 'active'">Active</TabBarItem>
					<TabBarItem :active="isActiveTab('archived')" @click="activeTab = 'archived'"> Archived </TabBarItem>
				</TabBar>
			</div>
			<SecondaryButton :icon="PlusIcon" @click="showCreateProjectModal = true">Créer un module </SecondaryButton>
			<ProjectCreateModal
				v-model:show="showCreateProjectModal"
				:create-client="createClient"
				:clients="clients"
				@submit="createModule"
			></ProjectCreateModal>
		</MainContainer>
		<ProjectTable :projects="shownModules"></ProjectTable>
	</AppLayout>
</template>
