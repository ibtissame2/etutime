<script setup>
import MainContainer from '@/Components/src/MainContainer.vue';
import TimeTrackerStartStop from '@/Components/TimeTracker/TimeTrackerStartStop.vue';
import TimeEntryRangeSelector from '@/Components/TimeEntry/TimeEntryRangeSelector.vue';
import TimeEntryDescriptionInput from '@/Components/TimeEntry/TimeEntryDescriptionInput.vue';
import TimeEntryRowTagDropdown from '@/Components/TimeEntry/TimeEntryRowTagDropdown.vue';
import TimeEntryRowDurationInput from '@/Components/TimeEntry/TimeEntryRowDurationInput.vue';
import TimeEntryMoreOptionsDropdown from '@/Components/TimeEntry/TimeEntryMoreOptionsDropdown.vue';
import { computed } from 'vue';
import TimeTrackerDropdown from '@/Components/TimeTracker/TimeTrackerDropdown.vue';
import Checkbox from '@/Components/src/Input/Checkbox.vue';

const props = defineProps({
	timeEntry: Object,
	indent: Boolean,
	projects: Array,
	tasks: Array,
	tags: Array,
	members: {
		type: Array,
		required: false,
	},
	onStartStopClick: Function,
	deleteTimeEntry: Function,
	updateTimeEntry: Function,
	showMember: {
		type: Boolean,
		required: false,
	},
	showDate: {
		type: Boolean,
		required: false,
	},
	selected: {
		type: Boolean,
		required: false,
	},
	canCreateProject: Boolean,
});

const emit = defineEmits(['selected', 'unselected']);

function updateTimeEntryDescription(description) {
	props.updateTimeEntry({ ...props.timeEntry, description });
}

function updateTimeEntryTags(tags) {
	props.updateTimeEntry({ ...props.timeEntry, tags });
}

function updateStartEndTime(start, end) {
	props.updateTimeEntry({ ...props.timeEntry, start, end });
}

function updateProjectAndTask(projectId, taskId) {
	props.updateTimeEntry({
		...props.timeEntry,
		project_id: projectId,
		task_id: taskId,
	});
}

const memberName = computed(() => {
	if (props.members) {
		const member = props.members.find((member) => member.user_id === props.timeEntry.user_id);
		if (member) {
			return member.name;
		}
	}
	return '';
});

function onSelectChange(event) {
	const target = event.target;
	if (target.checked) {
		emit('selected');
	} else {
		emit('unselected');
	}
}
</script>

<template>
	<div
		class="border-b border-default-background-separator transition min-w-0 bg-row-background"
		data-testid="time_entry_row"
	>
		<MainContainer class="min-w-0">
			<div class="sm:flex py-2 min-w-0 items-center justify-between group">
				<div class="flex items-center min-w-0">
					<Checkbox :checked="selected" @update:checked="onSelectChange" />
					<div v-if="indent === true" class="w-10 h-7"></div>
					<TimeEntryDescriptionInput
						class="min-w-0 mr-4"
						:model-value="timeEntry.description"
						@changed="updateTimeEntryDescription"
					></TimeEntryDescriptionInput>
					<TimeTrackerDropdown
						type="module"
						:elements="projects"
						:show-badge-border="false"
						:project="timeEntry.project_id"
						@change="updateProjectAndTask"
					></TimeTrackerDropdown>
				</div>
				<div class="flex items-center font-medium space-x-1 lg:space-x-2">
					<div v-if="showMember && members" class="text-sm px-2">
						{{ memberName }}
					</div>
					<TimeEntryRowTagDropdown
						:tags="tags"
						:model-value="timeEntry.tags"
						@changed="updateTimeEntryTags"
					></TimeEntryRowTagDropdown>
					<div class="flex-1">
						<TimeEntryRangeSelector
							class="hidden lg:block"
							:start="timeEntry.start"
							:end="timeEntry.end"
							:show-date
							@changed="updateStartEndTime"
						></TimeEntryRangeSelector>
					</div>
					<TimeEntryRowDurationInput
						:start="timeEntry.start"
						:end="timeEntry.end"
						@changed="updateStartEndTime"
					></TimeEntryRowDurationInput>
					<TimeTrackerStartStop
						:active="!!(timeEntry.start && !timeEntry.end)"
						class="opacity-20 hidden sm:flex focus-visible:opacity-100 group-hover:opacity-100"
						@changed="onStartStopClick"
					></TimeTrackerStartStop>
					<TimeEntryMoreOptionsDropdown @delete="deleteTimeEntry"></TimeEntryMoreOptionsDropdown>
				</div>
			</div>
		</MainContainer>
	</div>
</template>

<style scoped></style>
