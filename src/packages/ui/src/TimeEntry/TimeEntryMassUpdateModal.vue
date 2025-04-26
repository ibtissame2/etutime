<script setup>
import TextInput from '../Input/TextInput.vue';
import SecondaryButton from '../Buttons/SecondaryButton.vue';
import DialogModal from '@/packages/ui/src/DialogModal.vue';
import { nextTick, ref, watch } from 'vue';
import PrimaryButton from '../Buttons/PrimaryButton.vue';
import TimeTrackerProjectTaskDropdown from '@/packages/ui/src/TimeTracker/TimeTrackerProjectTaskDropdown.vue';
import InputLabel from '../Input/InputLabel.vue';
import { Badge, Checkbox } from '@/packages/ui/src';
import TagDropdown from '@/packages/ui/src/Tag/TagDropdown.vue';

const show = defineModel('show', { default: false });
const saving = ref(false);

const props = defineProps({
	timeEntries: Array,
	projects: Array,
	tasks: Array,
	clients: Array,
	tags: Array,
	createClient: Function,
	createTag: Function,
	updateTimeEntries: Function,
	currency: String,
	enableEstimatedTime: Boolean,
	canCreateProject: Boolean,
});

const emit = defineEmits(['submit']);

const descriptionInput = ref(null);

watch(show, (value) => {
	if (value) {
		nextTick(() => descriptionInput.value?.focus());
	}
});

const description = ref('');
const taskId = ref(undefined);
const projectId = ref(null);
const selectedTags = ref([]);

async function submit() {
	saving.value = true;
	const timeEntryUpdatesBody = {};
	if (description.value && description.value !== '') {
		timeEntryUpdatesBody.description = description.value;
	}
	if (projectId.value !== null) {
		if (projectId.value === '') {
			timeEntryUpdatesBody.project_id = null;
		} else {
			timeEntryUpdatesBody.project_id = projectId.value;
		}
		timeEntryUpdatesBody.task_id = null;
		if (taskId.value !== undefined) {
			timeEntryUpdatesBody.task_id = taskId.value;
		}
	}

	if (selectedTags.value.length > 0) {
		timeEntryUpdatesBody.tags = selectedTags.value;
	}
	if (removeAllTags.value) {
		timeEntryUpdatesBody.tags = [];
	}

	try {
		await props.updateTimeEntries({ ...timeEntryUpdatesBody });

		show.value = false;
		emit('submit');
		description.value = '';
		projectId.value = null;
		taskId.value = undefined;
		selectedTags.value = [];
		saving.value = false;
		removeAllTags.value = false;
	} catch {
		saving.value = false;
	}
}
const removeAllTags = ref(false);
watch(removeAllTags, () => {
	if (removeAllTags.value) {
		selectedTags.value = [];
	}
});
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span> Update {{ timeEntries.length }} time entries </span>
			</div>
		</template>

		<template #content>
			<div class="space-y-4">
				<div class="space-y-2">
					<InputLabel for="description" value="Description" />
					<TextInput
						id="description"
						ref="descriptionInput"
						v-model="description"
						type="text"
						class="mt-1 block w-full"
						@keydown.enter="submit"
					/>
				</div>
				<div class="space-y-2">
					<InputLabel for="project" value="Project" />
					<TimeTrackerProjectTaskDropdown
						v-model:project="projectId"
						v-model:task="taskId"
						:clients
						:create-client
						:currency="currency"
						:can-create-project
						class="mt-1"
						empty-placeholder="Select project..."
						allow-reset
						size="xlarge"
						:enable-estimated-time
						:projects="projects"
						:tasks="tasks"
					></TimeTrackerProjectTaskDropdown>
				</div>
				<div class="space-y-2">
					<InputLabel for="project" value="Tag" />
					<div class="flex space-x-5">
						<TagDropdown v-model="selectedTags" :create-tag :tags="tags">
							<template #trigger>
								<Badge :disabled="removeAllTags" tag="button" size="xlarge">
									<span v-if="selectedTags.length > 0"> Set {{ selectedTags.length }} tags </span>
									<span v-else> Select Tags... </span>
								</Badge>
							</template>
						</TagDropdown>
						<div class="flex items-center space-x-2">
							<Checkbox id="no_tags" v-model:checked="removeAllTags"></Checkbox>
							<InputLabel for="no_tags" value="Remove all tags" />
						</div>
					</div>
				</div>
			</div>
		</template>
		<template #footer>
			<SecondaryButton @click="show = false"> Cancel</SecondaryButton>
			<PrimaryButton class="ms-3" :class="{ 'opacity-25': saving }" :disabled="saving" @click="submit">
				Update Time Entries
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
