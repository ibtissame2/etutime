<script setup>
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import { UserCircleIcon } from '@heroicons/vue/24/solid';
import { PlusIcon } from '@heroicons/vue/16/solid';
import { ref } from 'vue';
import ClientTableRow from '@/Components/Common/Client/ClientTableRow.vue';
import ClientCreateModal from '@/Components/Common/Client/ClientCreateModal.vue';
import ClientTableHeading from '@/Components/Common/Client/ClientTableHeading.vue';
import { canCreateClients } from '@/utils/permissions';

const props = defineProps({
	clients: {
		type: Array,
		required: true,
	},
});

const createClient = ref(false);
</script>

<template>
	<ClientCreateModal v-model:show="createClient" />
	<div class="flow-root max-w-[100vw] overflow-x-auto">
		<div class="inline-block min-w-full align-middle">
			<div data-testid="client_table" class="grid min-w-full" style="grid-template-columns: 1fr 150px 200px 80px">
				<ClientTableHeading />
				<div v-if="props.clients.length === 0" class="col-span-2 py-24 text-center">
					<UserCircleIcon class="w-8 text-icon-default inline pb-2" />
					<h3 class="text-text-primary font-semibold">No clients found</h3>
					<p v-if="canCreateClients()" class="pb-5">Create your first client now!</p>
					<SecondaryButton v-if="canCreateClients()" :icon="PlusIcon" @click="createClient = true">
						Create your First Client
					</SecondaryButton>
				</div>
				<template v-for="client in props.clients" :key="client.id">
					<ClientTableRow :client="client" />
				</template>
			</div>
		</div>
	</div>
</template>
