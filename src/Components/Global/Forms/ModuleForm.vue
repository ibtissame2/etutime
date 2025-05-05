<script setup>
import { ref, watch } from 'vue';
import { useFocus } from '@vueuse/core';
import { useModulesStore } from '@/store/modules';
import { getRandomColor } from '@/packages/ui/src/utils/color';
import DialogModal from '@/packages/ui/src/DialogModal.vue';
import InputLabel from '@/packages/ui/src/Input/InputLabel.vue';
import TextInput from '@/packages/ui/src/Input/TextInput.vue';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import PrimaryButton from '@/packages/ui/src/Buttons/PrimaryButton.vue';
import ProjectColorSelector from '@/packages/ui/src/Project/ProjectColorSelector.vue';

const { createModule, updateModule } = useModulesStore();

const props = defineProps({
	origin: { type: Object, required: false },
});

const show = defineModel('show', { default: false });
const loading = ref(false);
const module = ref({});

const getFormData = () => {
	return { name: props.origin?.name || '', color: props.origin?.color || getRandomColor() };
};

const resetFormData = (hide = true) => {
	module.value = getFormData();
	if (hide) show.value = false;
};

watch(
	() => props.origin,
	() => resetFormData(false)
);

async function submit() {
	loading.value = true;
	if (props.origin) await updateModule(props.origin.id, module.value, () => resetFormData());
	else await createModule(module.value, () => resetFormData());
	loading.value = false;
}

const projectNameInput = ref(null);
useFocus(projectNameInput, { initialValue: true });
</script>

<template>
	<DialogModal closeable :show="show" @close="resetFormData()">
		<template #title>
			<div class="flex space-x-2">
				<span>{{ origin ? 'Modifier le module' : 'Créer un module' }}</span>
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
					<InputLabel for="projectName" value="Project name" />
					<TextInput
						id="projectName"
						ref="projectNameInput"
						v-model="module.name"
						type="text"
						placeholder="Project Name"
						class="mt-1 block w-full"
						required
						autocomplete="projectName"
						@keydown.enter="submit()"
					/>
				</div>
			</div>
		</template>

		<template #footer>
			<SecondaryButton @click="resetFormData()">Annuler</SecondaryButton>
			<PrimaryButton class="ms-3" :class="{ 'opacity-25': loading }" :disabled="loading" @click="submit">
				{{ origin ? 'Modifier' : 'Créer' }}
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
