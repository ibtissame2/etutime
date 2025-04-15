<script>
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import ClientMoreOptionsDropdown from '@/Components/Common/Client/ClientMoreOptionsDropdown.vue';
import { useClientsStore } from '@/utils/useClients';
import { useProjectsStore } from '@/utils/useProjects';
import TableRow from '@/Components/TableRow.vue';
import ClientEditModal from '@/Components/Common/Client/ClientEditModal.vue';

export default {
	components: {
		CheckCircleIcon,
		ClientMoreOptionsDropdown,
		TableRow,
		ClientEditModal,
	},
	props: {
		client: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		const { projects } = storeToRefs(useProjectsStore());
		const showEditModal = ref(false);

		const projectCount = computed(() => {
			return projects.value.filter((project) => project.client_id === props.client.id).length;
		});

		function deleteClient() {
			useClientsStore().deleteClient(props.client.id);
		}

		function archiveClient() {
			useClientsStore().updateClient(props.client.id, {
				...props.client,
				is_archived: !props.client.is_archived,
			});
		}

		return {
			projectCount,
			deleteClient,
			archiveClient,
			showEditModal,
		};
	},
};
</script>

<template>
	<TableRow>
		<ClientEditModal v-model:show="showEditModal" :client="client"></ClientEditModal>
		<div
			class="whitespace-nowrap flex items-center space-x-5 3xl:pl-12 py-4 pr-3 text-sm font-medium text-text-primary pl-4 sm:pl-6 lg:pl-8 3xl:pl-12"
		>
			<span>
				{{ client.name }}
			</span>
		</div>
		<div
			class="whitespace-nowrap flex items-center space-x-5 3xl:pl-12 py-4 pr-3 text-sm font-medium text-text-primary pl-4 sm:pl-6 lg:pl-8 3xl:pl-12"
		>
			<span class="text-muted"> {{ projectCount }} Projects </span>
		</div>
		<div class="whitespace-nowrap px-3 py-4 text-sm text-muted flex space-x-1 items-center font-medium">
			<CheckCircleIcon class="w-5"></CheckCircleIcon>
			<span>Active</span>
		</div>
		<div
			class="relative whitespace-nowrap flex items-center pl-3 text-right text-sm font-medium sm:pr-0 pr-4 sm:pr-6 lg:pr-8 3xl:pr-12"
		>
			<ClientMoreOptionsDropdown
				:client="client"
				@edit="showEditModal = true"
				@archive="archiveClient"
				@delete="deleteClient"
			></ClientMoreOptionsDropdown>
		</div>
	</TableRow>
</template>

<style scoped></style>
