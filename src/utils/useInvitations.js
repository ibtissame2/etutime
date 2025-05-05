import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getCurrentOrganizationId } from '@/utils/useUser';
import { useNotificationsStore } from '@/utils/notification';

export const useInvitationsStore = defineStore('invitations', () => {
	const invitationsResponse = ref(null);
	const { handleApiRequestNotifications } = useNotificationsStore();

	async function fetchInvitations() {
		const organization = getCurrentOrganizationId();
		if (organization) {
			invitationsResponse.value = await handleApiRequestNotifications(
				() =>
					api.getInvitations({
						params: {
							organization: organization,
						},
					}),
				undefined,
				'Failed to fetch invitations'
			);
		}
	}

	async function createInvitation(inviteBody) {
		const organization = getCurrentOrganizationId();
		if (organization) {
			await handleApiRequestNotifications(
				() =>
					api.invite(inviteBody, {
						params: {
							organization: organization,
						},
					}),
				'User successfully invited',
				'Failed to invite user'
			);
			await fetchInvitations();
		}
	}

	const invitations = computed(() => invitationsResponse.value?.data || []);

	return { invitations, fetchInvitations, createInvitation };
});
