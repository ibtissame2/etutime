<script setup>
import { ref, watch } from 'vue';
import { useFocus } from '@vueuse/core';
import { useModulesStore } from '@/store/modules';
import { getRandomColor } from '@/Components/src/utils/color';
import DialogModal from '@/Components/src/DialogModal.vue';
import InputLabel from '@/Components/src/Input/InputLabel.vue';
import TextInput from '@/Components/src/Input/TextInput.vue';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import PrimaryButton from '@/Components/src/Buttons/PrimaryButton.vue';
import ProjectColorSelector from '@/Components/Module/ModuleColorSelector.vue';

const { createModule, updateModule } = useModulesStore();

const show = defineModel('show', { default: false });
const loading = ref(false);
const module = ref({});

const extractData = (module) => {
	return {
		id: module?.id,
		name: module?.name || '',
		color: module?.color || getRandomColor(),
	};
};

const clearData = () => {
	module.value = extractData(null);
	show.value = false;
};

function setDataOf(element) {
	module.value = extractData(element || null);
	show.value = true;
}

async function submit() {
	loading.value = true;
	if (module.value.id) await updateModule(module.value.id, module.value, () => clearData());
	else await createModule(module.value, () => clearData());
	loading.value = false;
}

const moduleNameInput = ref(null);
useFocus(moduleNameInput, { initialValue: true });

defineExpose({ setDataOf });
</script>

<template>
	<DialogModal closeable :show="show" @close="clearData()">
		<template #title>
			<div class="flex space-x-2">
				<span>{{ module.id ? 'Modifier le module' : 'Créer un module' }}</span>
			</div>
		</template>

		<template #content>
			<div class="sm:flex items-center space-y-2 sm:space-y-0 sm:space-x-5">
				<div class="flex-1 flex items-center">
					<div class="text-center">
						<InputLabel for="color" value="Color" />
						<ProjectColorSelector v-model="module.color" class="mt-1"></ProjectColorSelector>
					</div>
				</div>
				<div class="w-full">
					<InputLabel for="moduleName" value="Nom du module" />
					<TextInput
						id="moduleName"
						ref="moduleNameInput"
						v-model="module.name"
						type="text"
						placeholder="Nom du module"
						class="mt-1 block w-full"
						required
						autocomplete="moduleName"
						@keydown.enter="submit()"
					/>
				</div>
			</div>
		</template>

		<template #footer>
			<SecondaryButton @click="clearData()">Annuler</SecondaryButton>
			<PrimaryButton class="ms-3" :class="{ 'opacity-25': loading }" :disabled="loading" @click="submit">
				{{ module.id ? 'Modifier' : 'Créer' }}
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
