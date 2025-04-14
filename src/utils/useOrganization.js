import { router } from './inertia';
// import { initializeStores } from '@/utils/init';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
// import { useNotificationsStore } from '@/utils/notification';
import { getCurrentOrganizationId } from '@/utils/useUser';
// import { api } from '@/packages/api/src';

export function switchOrganization(organizationId) {
	router.put(
		route('current-team.update'),
		{
			team_id: organizationId,
		},
		{
			preserveState: false,
			onSuccess: () => {
				initializeStores();
			},
		}
	);
}

export const useOrganizationStore = defineStore('organization', () => {
	const organizationResponse = ref(null);
	const { handleApiRequestNotifications } = useNotificationsStore();

	async function fetchOrganization() {
		const organization = getCurrentOrganizationId();
		if (organization) {
			organizationResponse.value = await handleApiRequestNotifications(
				() =>
					api.getOrganization({
						params: {
							organization: organization,
						},
					}),
				undefined,
				'Failed to fetch organization'
			);
		}
	}

	async function updateOrganization(organizationBody) {
		const organization = getCurrentOrganizationId();
		if (organization) {
			await handleApiRequestNotifications(
				() =>
					api.updateOrganization(organizationBody, {
						params: {
							organization: organization,
						},
					}),
				'Organization updated successfully',
				'Failed to update organization'
			);
			await fetchOrganization();
		}
	}

	const organization = computed(() => {
		return organizationResponse.value?.data || null;
	});

	return { organization, fetchOrganization, updateOrganization };
});
