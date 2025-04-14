import { defineStore } from 'pinia';
import { getCurrentOrganizationId } from '@/utils/useUser';
import { api } from '@/packages/api/src';
import { reactive, ref } from 'vue';
import { useNotificationsStore } from '@/utils/notification';

export const useTasksStore = defineStore('tasks', () => {
	const tasks = ref(reactive([]));
	const { handleApiRequestNotifications } = useNotificationsStore();

	async function fetchTasks() {
		const organizationId = getCurrentOrganizationId();
		if (organizationId) {
			const tasksResponse = await handleApiRequestNotifications(() =>
				api.getTasks({
					params: {
						organization: organizationId,
					},
					queries: {
						done: 'all',
					},
				})
			);
			if (tasksResponse?.data) {
				tasks.value = tasksResponse.data;
			}
		}
	}

	async function updateTask(taskId, taskBody) {
		const organizationId = getCurrentOrganizationId();
		if (organizationId) {
			await handleApiRequestNotifications(
				() =>
					api.updateTask(taskBody, {
						params: {
							task: taskId,
							organization: organizationId,
						},
					}),
				'Task updated successfully',
				'Failed to update task'
			);
			await fetchTasks();
		}
	}

	async function createTask(task) {
		const organizationId = getCurrentOrganizationId();
		if (organizationId) {
			await handleApiRequestNotifications(
				() =>
					api.createTask(task, {
						params: {
							organization: organizationId,
						},
					}),
				'Task created successfully',
				'Failed to create task'
			);
			await fetchTasks();
		}
	}

	async function deleteTask(taskId) {
		const organizationId = getCurrentOrganizationId();
		if (organizationId) {
			await handleApiRequestNotifications(
				() =>
					api.deleteTask(undefined, {
						params: {
							organization: organizationId,
							task: taskId,
						},
					}),
				'Task deleted successfully',
				'Failed to delete task'
			);
			await fetchTasks();
		}
	}

	return {
		tasks,
		fetchTasks,
		updateTask,
		createTask,
		deleteTask,
	};
});
