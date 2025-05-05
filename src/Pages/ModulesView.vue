<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useModulesStore } from '@/store/modules';
import { formatHumanReadableDuration } from '@/packages/ui/src/utils/time';
import { CheckCircleIcon, ArchiveBoxIcon } from '@heroicons/vue/20/solid';
import TablePageView from '@/Components/Global/TablePageView.vue';
import ModuleForm from '@/Components/Global/Forms/ModuleForm.vue';
import TabBarItem from '@/Components/Common/TabBar/TabBarItem.vue';
import TabBar from '@/Components/Common/TabBar/TabBar.vue';
import ModuleProgress from '@/Components/Common/Module/ModuleProgress.vue';

const { modules } = storeToRefs(useModulesStore());
const { fetchModules, updateModule, deleteModule } = useModulesStore();

const tableColumns = [
	{ id: 'name', label: 'Name', size: 'minmax(300px, 1fr)' },
	{ id: 'time', label: 'Total Time', size: 'minmax(140px, auto)' },
	{ id: 'progress', label: 'Progress', size: 'minmax(130px, auto)' },
	{ id: 'status', label: 'Status', size: 'minmax(120px, auto)' },
];

const noData = {
	title: 'Aucun module trouvé',
	description: 'Créez votre premier module maintenant !',
	button: 'Créez votre premier module',
};

const dropdown = [
	{
		icon: 'edit',
		label: 'Modifier',
		onclick: (module, showForm) => showForm(module),
	},
	{
		icon: ArchiveBoxIcon,
		label: (module) => (module.is_public ? 'Archiver' : 'Désarchiver'),
		onclick: (module) => updateModule(module.id, { is_public: !module.is_public }),
	},
	{
		border: true,
		icon: 'delete',
		label: 'Supprimer',
		onclick: (module) => deleteModule(module.id),
	},
];

const activeTab = ref('active');

const shownModules = computed(() => {
	if (activeTab.value !== 'archived') return modules.value.filter((module) => module.is_public);
	return modules.value.filter((module) => !module.is_public);
});
</script>

<template>
	<TablePageView
		title="Modules"
		create="Créer un module"
		:data="shownModules"
		:modal="ModuleForm"
		:columns="tableColumns"
		:dropdown="dropdown"
		:no-data="noData"
		:dropdown-min-width="150"
		@fetch="fetchModules()"
	>
		<template #table-filters>
			<TabBar>
				<TabBarItem :active="activeTab === 'active'" @click="activeTab = 'active'">Active</TabBarItem>
				<TabBarItem :active="activeTab === 'archived'" @click="activeTab = 'archived'"> Archived </TabBarItem>
			</TabBar>
		</template>

		<template #name="{ data: module }">
			<div
				:style="{
					backgroundColor: module.color,
					boxShadow: `var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) ${module.color}30`,
				}"
				class="w-3 h-3 mr-2 rounded-full"
			></div>
			<span class="overflow-ellipsis overflow-hidden">{{ module.name }} </span>
		</template>

		<template #time="{ data: module }">
			{{ module.spent_time ? formatHumanReadableDuration(module.spent_time) : '--' }}
		</template>

		<template #progress="{ data: module }">
			<ModuleProgress :module="module" />
		</template>

		<template #status="{ data: module }">
			<CheckCircleIcon class="w-5 mr-1"></CheckCircleIcon>
			<span>{{ module.is_public ? 'Actif' : 'Archivé' }}</span>
		</template>
	</TablePageView>
</template>
