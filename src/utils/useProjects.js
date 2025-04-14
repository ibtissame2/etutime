import { defineStore } from 'pinia';
import { api } from '@/packages/api/src';
import { computed, ref } from 'vue';
import { getCurrentOrganizationId } from '@/utils/useUser';
import { useNotificationsStore } from '@/utils/notification';

export const useProjectsStore = defineStore('projects', () => {
	const projectResponse = ref(null);
	const { handleApiRequestNotifications } = useNotificationsStore();
	async function fetchProjects() {
		const organization = getCurrentOrganizationId();
		if (organization) {
			projectResponse.value = await handleApiRequestNotifications(
				() =>
					api.getProjects({
						params: {
							organization: organization,
						},
						queries: {
							archived: 'all',
						},
					}),
				undefined,
				'Failed to fetch projects'
			);
		}
	}

	async function createProject(projectBody) {
		const organization = getCurrentOrganizationId();

		if (organization) {
			const response = await handleApiRequestNotifications(
				() =>
					api.createProject(projectBody, {
						params: {
							organization: organization,
						},
					}),
				'Project created successfully',
				'Failed to create project'
			);

			await fetchProjects();
			return response['data'];
		}
	}

	async function deleteProject(projectId) {
		const organizationId = getCurrentOrganizationId();
		if (organizationId) {
			await handleApiRequestNotifications(
				() =>
					api.deleteProject(undefined, {
						params: {
							organization: organizationId,
							project: projectId,
						},
					}),
				'Project deleted successfully',
				'Failed to delete project'
			);
			await fetchProjects();
		}
	}

	async function updateProject(projectId, updateProjectBody) {
		const organizationId = getCurrentOrganizationId();
		if (organizationId) {
			await handleApiRequestNotifications(
				() =>
					api.updateProject(updateProjectBody, {
						params: {
							organization: organizationId,
							project: projectId,
						},
					}),
				'Project updated successfully',
				'Failed to update project'
			);
			await fetchProjects();
		}
	}

	const projects = computed(() => projectResponse.value?.data || []);

	return {
		projects,
		fetchProjects,
		createProject,
		deleteProject,
		updateProject,
	};
});
