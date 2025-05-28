<script setup>
import { capitalizeFirstLetter } from '@/utils/format';
import InvitationMoreOptionsDropdown from '@/Components/Common/Invitation/InvitationMoreOptionsDropdown.vue';
import { getCurrentOrganizationId } from '@/utils/useUser';
import { useNotificationsStore } from '@/utils/notification';
import { useInvitationsStore } from '@/utils/useInvitations';

const { handleApiRequestNotifications } = useNotificationsStore();

const props = defineProps({
	invitation: {
		type: Object,
		required: true,
	},
});

async function deleteInvitation() {
	const organizationId = getCurrentOrganizationId();
	if (organizationId) {
		await handleApiRequestNotifications(
			() =>
				api.removeInvitation(undefined, {
					params: {
						invitation: props.invitation.id,
						organization: organizationId,
					},
				}),
			'Invitation removed successfully',
			'Error removing invitation',
			() => {
				useInvitationsStore().fetchInvitations();
			}
		);
	}
}

async function resendInvitation() {
	const organizationId = getCurrentOrganizationId();
	if (organizationId) {
		await handleApiRequestNotifications(
			() =>
				api.resendInvitationEmail(undefined, {
					params: {
						invitation: props.invitation.id,
						organization: organizationId,
					},
				}),
			'Invitation mail sent successfully',
			'Error sending invitation mail'
		);
	}
}
</script>

<template>
	<div
		role="row"
		class="contents group [&>*]:transition [&>*]:border-row-separator [&>*]:bg-row-background [&>*]:border-b"
	>
		<div class="whitespace-nowrap px-3 py-4 text-sm text-muted pl-4 sm:pl-6 lg:pl-8 3xl:pl-12">
			{{ props.invitation.email }}
		</div>
		<div class="whitespace-nowrap px-3 py-4 text-sm text-muted">
			{{ capitalizeFirstLetter(props.invitation.role) }}
		</div>
		<div
			class="relative whitespace-nowrap flex items-center pl-3 text-right text-sm font-medium pr-4 sm:pr-6 lg:pr-8 3xl:pr-12"
		>
			<InvitationMoreOptionsDropdown @delete="deleteInvitation" @resend="resendInvitation" />
		</div>
	</div>
</template>

<style scoped></style>
