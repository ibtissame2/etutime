<script>
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import { UserCircleIcon, PlusIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue';
import ClientTableRow from '@/Components/Common/Client/ClientTableRow.vue';
import ClientCreateModal from '@/Components/Common/Client/ClientCreateModal.vue';
import ClientTableHeading from '@/Components/Common/Client/ClientTableHeading.vue';
import { canCreateClients } from '@/utils/permissions';

export default {
	components: {
		SecondaryButton,
		UserCircleIcon,
		PlusIcon,
		ClientTableRow,
		ClientCreateModal,
		ClientTableHeading,
	},
	props: {
		clients: {
			type: Array,
			required: true,
		},
	},
	setup() {
		const createClient = ref(false);

		return {
			createClient,
			canCreateClients,
		};
	},
};
</script>

<template>
	<ClientCreateModal v-model:show="createClient"></ClientCreateModal>
	<div class="flow-root max-w-[100vw] overflow-x-auto">
		<div class="inline-block min-w-full align-middle">
			<div data-testid="client_table" class="grid min-w-full" style="grid-template-columns: 1fr 150px 200px 80px">
				<ClientTableHeading></ClientTableHeading>
				<div v-if="clients.length === 0" class="col-span-2 py-24 text-center">
					<UserCircleIcon class="w-8 text-icon-default inline pb-2"></UserCircleIcon>
					<h3 class="text-text-primary font-semibold">No clients found</h3>
					<p v-if="canCreateClients()" class="pb-5">Create your first client now!</p>
					<SecondaryButton v-if="canCreateClients()" :icon="PlusIcon" @click="createClient = true"
						>Create your First Client
					</SecondaryButton>
				</div>
				<template v-for="client in clients" :key="client.id">
					<ClientTableRow :client="client"></ClientTableRow>
				</template>
			</div>
		</div>
	</div>
</template>
