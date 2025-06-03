import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationsStore = defineStore('notifications', () => {
	const notifications = ref([]);

	function addNotification(type, title, message) {
		const uuid = Math.random().toString(36).substring(7);
		notifications.value.push({ title, message, type, uuid });
		setTimeout(() => {
			const index = notifications.value.findIndex((notification) => notification.uuid === uuid);
			if (index !== -1) {
				notifications.value.splice(index, 1);
			}
		}, 5000);
	}

	return {
		addNotification,
		notifications,
	};
});
