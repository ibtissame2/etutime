import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationsStore = defineStore('notifications', () => {
	const notifications = ref([]);
	const showActionBlockedModal = ref(false);

	function addNotification(type, title, message) {
		const uuid = Math.random().toString(36).substring(7);
		notifications.value.push({ title, message, type, uuid });
		setTimeout(() => {
			removeNotification(uuid);
		}, 5000);
	}

	function removeNotification(uuid) {
		const index = notifications.value.findIndex((notification) => notification.uuid === uuid);
		if (index !== -1) {
			notifications.value.splice(index, 1);
		}
	}

	async function handleApiRequestNotifications(apiRequest, successMessage, errorMessage, onSuccess) {
		try {
			const response = await apiRequest();
			if (response.isError) throw new Error(response.errorMessage);
			if (successMessage) addNotification('success', successMessage);
			if (onSuccess) onSuccess(response);
			return response;
		} catch (error) {
			console.log('Error:', error);
			addNotification('error', errorMessage);
		}
	}

	return {
		addNotification,
		notifications,
		handleApiRequestNotifications,
		showActionBlockedModal,
	};
});
