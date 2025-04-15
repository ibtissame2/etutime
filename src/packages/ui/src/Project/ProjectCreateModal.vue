<script setup>
import TextInput from '@/packages/ui/src/Input/TextInput.vue';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import DialogModal from '@/packages/ui/src/DialogModal.vue';
import { computed, ref } from 'vue';
import { getRandomColor } from '@/packages/ui/src/utils/color';
import PrimaryButton from '@/packages/ui/src/Buttons/PrimaryButton.vue';
import { useFocus } from '@vueuse/core';
import ClientDropdown from '@/packages/ui/src/Client/ClientDropdown.vue';
import Badge from '@/packages/ui/src/Badge.vue';
import ProjectColorSelector from '@/packages/ui/src/Project/ProjectColorSelector.vue';
import { UserCircleIcon } from '@heroicons/vue/20/solid';
import EstimatedTimeSection from '@/packages/ui/src/EstimatedTimeSection.vue';
import InputLabel from '@/packages/ui/src/Input/InputLabel.vue';
import ProjectEditBillableSection from '@/packages/ui/src/Project/ProjectEditBillableSection.vue';

const show = defineModel('show', { default: false });
const saving = ref(false);

const props = defineProps({
	clients: Array,
	createProject: Function,
	createClient: Function,
	currency: String,
	enableEstimatedTime: Boolean,
});

const activeClients = computed(() => {
	return props.clients.filter((client) => !client.is_archived);
});

const project = ref({
	name: '',
	color: getRandomColor(),
	client_id: null,
	billable_rate: null,
	is_billable: false,
	estimated_time: null,
});

async function submit() {
	await props.createProject(project.value);
	show.value = false;
	project.value = {
		name: '',
		color: getRandomColor(),
		client_id: null,
		billable_rate: null,
		is_billable: false,
		estimated_time: null,
	};
}

const projectNameInput = ref(null);

useFocus(projectNameInput, { initialValue: true });

const currentClientName = computed(() => {
	if (project.value.client_id) {
		return props.clients.find((client) => client.id === project.value.client_id)?.name;
	}
	return 'No Client';
});
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span>Créer un module</span>
			</div>
		</template>

		<template #content>
			<div class="sm:flex items-center space-y-2 sm:space-y-0 sm:space-x-4">
				<div class="flex-1 flex items-center">
					<div class="text-center pr-5">
						<InputLabel for="color" value="Color" />
						<ProjectColorSelector v-model="project.color" class="mt-2.5"></ProjectColorSelector>
					</div>
					<div class="w-full">
						<InputLabel for="projectName" value="Nom du module" />
						<TextInput
							id="projectName"
							ref="projectNameInput"
							v-model="project.name"
							name="projectName"
							type="text"
							placeholder="Nom du module"
							class="mt-2 block w-full"
							required
							autocomplete="projectName"
							@keydown.enter="submit()"
						/>
					</div>
				</div>
				<div>
					<EstimatedTimeSection
						v-if="enableEstimatedTime"
						v-model="project.estimated_time"
						@submit="submit()"
					></EstimatedTimeSection>
				</div>
			</div>
			<div class="lg:grid grid-cols-2 gap-12">
				<div></div>
			</div>
		</template>
		<template #footer>
			<SecondaryButton @click="show = false">Annuler</SecondaryButton>
			<PrimaryButton class="ms-3" :class="{ 'opacity-25': saving }" :disabled="saving" @click="submit">
				Créer
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
