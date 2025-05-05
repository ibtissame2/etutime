<script setup>
import TextInput from '@/Components/src/Input/TextInput.vue';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import DialogModal from '@/Components/src/DialogModal.vue';
import { ref, watch } from 'vue';
import PrimaryButton from '@/Components/src/Buttons/PrimaryButton.vue';
import { useFocus } from '@vueuse/core';
import { useTasksStore } from '@/utils/useTasks';
import ModuleDropdown from '@/Components//Module/ModuleDropdown.vue';
import EstimatedTimeSection from '@/Components/src/EstimatedTimeSection.vue';

const { createTask } = useTasksStore();
const show = defineModel('show', { default: false });
const saving = ref(false);

const taskName = ref('');
const estimatedTime = ref(null);

const props = defineProps({
	projectId: {
		type: String,
		required: true,
	},
});

const taskProjectId = ref(props.projectId);

watch(
	() => props.projectId,
	(value) => (taskProjectId.value = value)
);

async function submit() {
	saving.value = true;
	try {
		await createTask({
			name: taskName.value,
			project_id: taskProjectId.value,
			estimated_time: estimatedTime.value,
		});
		show.value = false;
		taskName.value = '';
		estimatedTime.value = null;
	} finally {
		saving.value = false;
	}
}

const taskNameInput = ref(null);

useFocus(taskNameInput, { initialValue: true });
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span>Create Task</span>
			</div>
		</template>

		<template #content>
			<div class="flex items-center space-x-4">
				<div class="col-span-6 sm:col-span-4 flex-1">
					<TextInput
						id="taskName"
						ref="taskNameInput"
						v-model="taskName"
						type="text"
						placeholder="Task Name"
						class="block w-full"
						required
						autocomplete="taskName"
						@keydown.enter="submit()"
					/>
				</div>
				<div class="col-span-6 sm:col-span-4">
					<ModuleDropdown v-model="taskProjectId"></ModuleDropdown>
				</div>
			</div>
			<EstimatedTimeSection v-model="estimatedTime" @submit="submit()"></EstimatedTimeSection>
		</template>
		<template #footer>
			<SecondaryButton @click="show = false">Cancel</SecondaryButton>
			<PrimaryButton class="ms-3" :class="{ 'opacity-25': saving }" :disabled="saving" @click="submit">
				Create Task
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
