<script setup>
import { ref } from 'vue';
import { useFocus } from '@vueuse/core';
import { useModulesStore } from '@/store/modules';
import { getRandomColor } from '@/packages/ui/src/utils/color';
import InputLabel from '@/packages/ui/src/Input/InputLabel.vue';
import TextInput from '@/packages/ui/src/Input/TextInput.vue';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import PrimaryButton from '@/packages/ui/src/Buttons/PrimaryButton.vue';
import ProjectColorSelector from '@/packages/ui/src/Project/ProjectColorSelector.vue';
import DialogModal from '@/packages/ui/src/DialogModal.vue';

const { createModule } = useModulesStore();

const show = defineModel('show', { default: false });
const loading = ref(false);

const resetFormData = () => {
	show.value = false;
	return { name: '', color: getRandomColor() };
};

const project = ref(resetFormData());

async function submit() {
	loading.value = true;
	await createModule(project.value, () => {
		project.value = resetFormData();
	});
	loading.value = false;
}

const moduleNameInput = ref(null);
useFocus(moduleNameInput, { initialValue: true });
</script>

<template>
	<DialogModal closeable :show="show" @close="project = resetFormData()">
		<template #title>
			<div class="flex space-x-2">
				<span>Créer un module</span>
			</div>
		</template>

		<template #content>
			<div class="sm:flex items-center space-y-2 sm:space-y-0 sm:space-x-4">
				<div class="flex-1 flex items-center">
					<div class="text-center pr-5">
						<InputLabel for="color" value="Couleur" />
						<ProjectColorSelector v-model="project.color" class="mt-2.5"></ProjectColorSelector>
					</div>
					<div class="w-full">
						<InputLabel for="projectName" value="Nom du module" />
						<TextInput
							id="projectName"
							ref="moduleNameInput"
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
			</div>
			<div class="lg:grid grid-cols-2 gap-12">
				<div></div>
			</div>
		</template>
		<template #footer>
			<SecondaryButton @click="project = resetFormData()">Annuler</SecondaryButton>
			<PrimaryButton class="ms-3" :class="{ 'opacity-25': loading }" :disabled="loading" @click="submit">
				Créer
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
