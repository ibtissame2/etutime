<script setup>
import TextInput from '@/packages/ui/src/Input/TextInput.vue';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import DialogModal from '@/packages/ui/src/DialogModal.vue';
import { computed, ref } from 'vue';
import PrimaryButton from '@/packages/ui/src/Buttons/PrimaryButton.vue';
import { useModulesStore } from '@/store/modules';
import { useFocus } from '@vueuse/core';
import Badge from '@/packages/ui/src/Badge.vue';
import ProjectColorSelector from '@/packages/ui/src/Project/ProjectColorSelector.vue';
import { UserCircleIcon } from '@heroicons/vue/20/solid';
import InputLabel from '@/packages/ui/src/Input/InputLabel.vue';

const { updateModule } = useModulesStore();
const show = defineModel('show', { default: false });
const saving = ref(false);
const props = defineProps({
	originalProject: Object,
});

const project = ref({
	name: props.originalProject.name,
	color: props.originalProject.color,
});

async function submit() {
	await updateModule(props.originalProject.id, project.value);
	show.value = false;
}

const projectNameInput = ref(null);

useFocus(projectNameInput, { initialValue: true });
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span> Edit Project {{ props.originalProject.name }} </span>
			</div>
		</template>

		<template #content>
			<div class="sm:flex items-center space-y-2 sm:space-y-0 sm:space-x-5">
				<div class="flex-1 flex items-center">
					<div class="text-center">
						<InputLabel for="color" value="Color" />
						<ProjectColorSelector v-model="project.color" class="mt-1"></ProjectColorSelector>
					</div>
				</div>
				<div class="w-full">
					<InputLabel for="projectName" value="Project name" />
					<TextInput
						id="projectName"
						ref="projectNameInput"
						v-model="project.name"
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
			<SecondaryButton @click="show = false"> Cancel</SecondaryButton>

			<PrimaryButton class="ms-3" :class="{ 'opacity-25': saving }" :disabled="saving" @click="submit">
				Modifier
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
