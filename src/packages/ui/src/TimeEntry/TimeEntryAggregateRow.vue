<script setup>
import MainContainer from '@/packages/ui/src/MainContainer.vue';
import TimeTrackerStartStop from '../TimeTrackerStartStop.vue';
import TimeEntryDescriptionInput from '@/packages/ui/src/TimeEntry/TimeEntryDescriptionInput.vue';
import TimeEntryRowTagDropdown from '@/packages/ui/src/TimeEntry/TimeEntryRowTagDropdown.vue';
import TimeEntryMoreOptionsDropdown from '@/packages/ui/src/TimeEntry/TimeEntryMoreOptionsDropdown.vue';
import TimeTrackerProjectTaskDropdown from '@/packages/ui/src/TimeTracker/TimeTrackerProjectTaskDropdown.vue';
import { ref } from 'vue';
import { formatHumanReadableDuration, formatStartEnd } from '@/packages/ui/src/utils/time';
import TimeEntryRow from '@/packages/ui/src/TimeEntry/TimeEntryRow.vue';
import GroupedItemsCountButton from '@/packages/ui/src/GroupedItemsCountButton.vue';
import { Checkbox } from '@/packages/ui/src';

const props = defineProps({
	timeEntry: Object,
	projects: Array,
	tasks: Array,
	tags: Array,
	clients: Array,
	createClient: Function,
	onStartStopClick: Function,
	updateTimeEntries: Function,
	updateTimeEntry: Function,
	deleteTimeEntries: Function,
	currency: String,
	selectedTimeEntries: Array,
	enableEstimatedTime: Boolean,
	canCreateProject: Boolean,
});

const emit = defineEmits(['selected', 'unselected']);

function updateTimeEntryDescription(description) {
	props.updateTimeEntries(
		props.timeEntry.timeEntries.map((timeEntry) => timeEntry.id),
		{ description: description }
	);
}

function updateTimeEntryTags(tags) {
	props.updateTimeEntries(
		props.timeEntry.timeEntries.map((timeEntry) => timeEntry.id),
		{ tags: tags }
	);
}

function updateProjectAndTask(projectId, taskId) {
	props.updateTimeEntries(
		props.timeEntry.timeEntries.map((timeEntry) => timeEntry.id),
		{ project_id: projectId, task_id: taskId }
	);
}

const expanded = ref(false);

function onSelectChange(event) {
	const target = event.target;
	if (target.checked) {
		emit('selected', [...props.timeEntry.timeEntries]);
	} else {
		emit('unselected', [...props.timeEntry.timeEntries]);
	}
}
</script>

<template>
	<div
		class="border-b border-default-background-separator bg-row-background min-w-0 transition"
		data-testid="time_entry_row"
	>
		<MainContainer class="min-w-0">
			<div class="sm:flex py-2 items-center min-w-0 justify-between group">
				<div class="flex space-x-3 items-center min-w-0">
					<Checkbox
						:checked="
							timeEntry.timeEntries.every((aggregateTimeEntry) => selectedTimeEntries.includes(aggregateTimeEntry))
						"
						@update:checked="onSelectChange"
					/>
					<div class="flex items-center min-w-0">
						<GroupedItemsCountButton :expanded="expanded" @click="expanded = !expanded">
							{{ timeEntry?.timeEntries?.length }}
						</GroupedItemsCountButton>
						<TimeEntryDescriptionInput
							class="min-w-0 mr-4"
							:model-value="timeEntry.description"
							@changed="updateTimeEntryDescription"
						></TimeEntryDescriptionInput>
						<TimeTrackerProjectTaskDropdown
							:clients
							:create-client
							:can-create-project
							:projects="projects"
							:tasks="tasks"
							:show-badge-border="false"
							:project="timeEntry.project_id"
							:enable-estimated-time
							:currency="currency"
							:task="timeEntry.task_id"
							@changed="updateProjectAndTask"
						></TimeTrackerProjectTaskDropdown>
					</div>
				</div>
				<div class="flex items-center font-medium lg:space-x-2">
					<TimeEntryRowTagDropdown
						:tags="tags"
						:model-value="timeEntry.tags"
						@changed="updateTimeEntryTags"
					></TimeEntryRowTagDropdown>
					<div class="flex-1">
						<button
							class="hidden lg:block text-muted w-[110px] px-1 py-1.5 bg-transparent text-center hover:bg-card-background rounded-lg border border-transparent hover:border-card-border text-sm font-medium focus-visible:outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-tertiary"
							@click="expanded = !expanded"
						>
							{{ formatStartEnd(timeEntry.start, timeEntry.end) }}
						</button>
					</div>
					<button
						class="text-text-primary min-w-[90px] px-2 py-1.5 bg-transparent text-center hover:bg-card-background rounded-lg border border-transparent hover:border-card-border text-sm font-semibold focus-visible:outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-tertiary"
						@click="expanded = !expanded"
					>
						{{ formatHumanReadableDuration(timeEntry.duration ?? 0) }}
					</button>

					<TimeTrackerStartStop
						:active="!!(timeEntry.start && !timeEntry.end)"
						class="opacity-20 hidden sm:flex group-hover:opacity-100 focus-visible:opacity-100"
						@changed="onStartStopClick(timeEntry)"
					></TimeTrackerStartStop>
					<TimeEntryMoreOptionsDropdown
						@delete="deleteTimeEntries(timeEntry?.timeEntries ?? [])"
					></TimeEntryMoreOptionsDropdown>
				</div>
			</div>
		</MainContainer>
		<div v-if="expanded" class="w-full border-t border-default-background-separator bg-black/15">
			<TimeEntryRow
				v-for="subEntry in timeEntry.timeEntries"
				:key="subEntry.id"
				:projects="projects"
				:enable-estimated-time
				:can-create-project
				:tasks="tasks"
				:selected="!!selectedTimeEntries.find((filterEntry) => filterEntry.id === subEntry.id)"
				:create-client
				:clients
				:tags="tags"
				indent
				:update-time-entry="(timeEntry) => updateTimeEntry(timeEntry)"
				:on-start-stop-click="() => onStartStopClick(subEntry)"
				:delete-time-entry="() => deleteTimeEntries([subEntry])"
				:currency="currency"
				:time-entry="subEntry"
				@selected="emit('selected', [subEntry])"
				@unselected="emit('unselected', [subEntry])"
			></TimeEntryRow>
		</div>
	</div>
</template>

<style scoped></style>
