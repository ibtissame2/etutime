<script>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useInvitationsStore } from '@/utils/useInvitations';
import InvitationTableRow from '@/Components/Common/Invitation/InvitationTableRow.vue';
import InvitationTableHeading from '@/Components/Common/Invitation/InvitationTableHeading.vue';

export default {
	components: {
		InvitationTableRow,
		InvitationTableHeading,
	},
	setup() {
		const { invitations } = storeToRefs(useInvitationsStore());

		onMounted(async () => {
			await useInvitationsStore().fetchInvitations();
		});

		return {
			invitations,
		};
	},
};
</script>

<template>
	<div class="flow-root max-w-[100vw] overflow-x-auto">
		<div class="inline-block min-w-full align-middle">
			<div data-testid="client_table" class="grid min-w-full" style="grid-template-columns: 1fr 1fr 80px">
				<InvitationTableHeading></InvitationTableHeading>
				<template v-for="invitation in invitations" :key="invitation.id">
					<InvitationTableRow :invitation="invitation"></InvitationTableRow>
				</template>
			</div>
		</div>
	</div>
</template>
