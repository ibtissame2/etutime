import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { router } from './inertia';
import { fetchToken } from '@/utils/session';

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
        const index = notifications.value.findIndex(
            (notification) => notification.uuid === uuid
        );
        if (index !== -1) {
            notifications.value.splice(index, 1);
        }
    }

    async function handleApiRequestNotifications(apiRequest, successMessage, errorMessage, onSuccess) {
        let a = true;
        if (a) return;
        // Ibtissame
        try {
            const response = await apiRequest();
            if (successMessage) {
                addNotification('success', successMessage);
            }
            if (onSuccess) {
                onSuccess(response);
            }
            return response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (
                    error?.response?.status === 403 ||
                    error?.response?.status === 400
                ) {
                    if (
                        error?.response?.data?.key ===
                        'organization_has_no_subscription_but_multiple_members'
                    ) {
                        showActionBlockedModal.value = true;
                    } else {
                        addNotification(
                            'error',
                            errorMessage ?? 'Request Error',
                            error.response?.data?.errorMessage ??
                                error?.response?.data?.message ??
                                'An request error occurred. Please try again later.'
                        );
                    }
                } else if (error?.response?.status === 422) {
                    const message = error.response.data.message;
                    addNotification('error', message);
                } else if (error?.response?.status === 401) {
                    await fetchToken();
                    try {
                        const response = await apiRequest();
                        if (successMessage) {
                            addNotification('success', successMessage);
                        }
                        if (onSuccess) {
                            onSuccess(response);
                        }
                        return response;
                    } catch {
                        router.get(route('login'));
                    }
                } else {
                    addNotification(
                        'error',
                        'The action failed. Please try again later.'
                    );
                }
            }
            throw new Error('Failed to handle API request');
        }
    }

    return {
        addNotification,
        notifications,
        handleApiRequestNotifications,
        showActionBlockedModal,
    };
});
