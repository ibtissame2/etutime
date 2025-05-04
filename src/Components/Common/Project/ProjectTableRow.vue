<script setup>
import ProjectMoreOptionsDropdown from '@/Components/Common/Project/ProjectMoreOptionsDropdown.vue';
import { ref } from 'vue';
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import { useModulesStore } from '@/store/modules';
import TableRow from '@/Components/TableRow.vue';
import ProjectEditModal from '@/Components/Common/Project/ProjectEditModal.vue';
import ProjectProgress from '@/components/common/Project/ProjectProgress.vue';
import { formatHumanReadableDuration } from '../../../packages/ui/src/utils/time';
import { route } from '@/utils/inertia';

const props = defineProps({
	project: {
		type: Object,
		required: true,
	},
});

function archiveProject() {
	useModulesStore().updateModule(props.project.id, { is_public: !props.project.is_public });
}

function deleteProject() {
	useModulesStore().deleteModule(props.project.id);
}

const showEditProjectModal = ref(false);
</script>

<template>
	<ProjectEditModal v-model:show="showEditProjectModal" :original-project="project"></ProjectEditModal>
	<TableRow :href="route('projects.show', { project: project.id })">
		<div
			class="whitespace-nowrap min-w-0 flex items-center space-x-5 3xl:pl-12 py-4 pr-3 text-sm font-medium text-text-primary pl-4 sm:pl-6 lg:pl-8 3xl:pl-12"
		>
			<div
				:style="{
					backgroundColor: project.color,
					boxShadow: `var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) ${project.color}30`,
				}"
				class="w-3 h-3 rounded-full"
			></div>
			<span class="overflow-ellipsis overflow-hidden">
				{{ project.name }}
			</span>
		</div>
		<div class="whitespace-nowrap px-3 py-4 text-sm text-muted">
			<div v-if="project.spent_time">
				{{ formatHumanReadableDuration(project.spent_time) }}
			</div>
			<div v-else>--</div>
		</div>
		<div class="whitespace-nowrap px-3 flex items-center text-sm text-muted">
			<ProjectProgress :module="project" />
		</div>
		<div class="whitespace-nowrap px-3 py-4 text-sm text-muted flex space-x-1 items-center font-medium">
			<CheckCircleIcon class="w-5"></CheckCircleIcon>
			<span>{{ project.is_public ? 'Actif' : 'Archivé' }}</span>
		</div>
		<div
			class="relative whitespace-nowrap flex items-center pl-3 text-right text-sm font-medium pr-4 sm:pr-6 lg:pr-8 3xl:pr-12"
		>
			<ProjectMoreOptionsDropdown
				:project="project"
				@edit="showEditProjectModal = true"
				@archive="archiveProject"
				@delete="deleteProject"
			></ProjectMoreOptionsDropdown>
		</div>
	</TableRow>
</template>

<style scoped></style>
