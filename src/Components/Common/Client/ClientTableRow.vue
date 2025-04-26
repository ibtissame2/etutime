<script setup>
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import { useClientsStore } from '@/utils/useClients';
import ClientMoreOptionsDropdown from '@/Components/Common/Client/ClientMoreOptionsDropdown.vue';
import { useModulesStore } from '@/store/modules';
import TableRow from '@/Components/TableRow.vue';
import ClientEditModal from '@/Components/Common/Client/ClientEditModal.vue';
import { computed, ref } from 'vue';

const props = defineProps({
	client: {
		type: Object,
		required: true,
	},
});

const { modules } = useModulesStore();
const projectCount = computed(() => modules.value.length);

function deleteClient() {
	useClientsStore().deleteClient(props.client.id);
}

function archiveClient() {
	useClientsStore().updateClient(props.client.id, {
		...props.client,
		is_archived: !props.client.is_archived,
	});
}

const showEditModal = ref(false);
</script>

<template>
	<TableRow>
		<ClientEditModal v-model:show="showEditModal" :client="client" />
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
			<CheckCircleIcon class="w-5" />
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
			/>
		</div>
	</TableRow>
</template>

<style scoped></style>
