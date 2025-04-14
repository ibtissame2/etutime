<script setup>
import { computed } from 'vue';
import { getDayJsInstance, getLocalizedDateFromTimestamp } from '@/packages/ui/src/utils/time';
import TimeEntryAggregateRow from '@/packages/ui/src/TimeEntry/TimeEntryAggregateRow.vue';
import TimeEntryRowHeading from '@/packages/ui/src/TimeEntry/TimeEntryRowHeading.vue';
import TimeEntryRow from '@/packages/ui/src/TimeEntry/TimeEntryRow.vue';

const selectedTimeEntries = defineModel('selected', { default: [] });

const props = defineProps({
	timeEntries: Array,
	projects: Array,
	tasks: Array,
	tags: Array,
	clients: Array,
	createTag: Function,
	updateTimeEntry: Function,
	updateTimeEntries: Function,
	deleteTimeEntries: Function,
	createTimeEntry: Function,
	createProject: Function,
	createClient: Function,
	currency: String,
	enableEstimatedTime: Boolean,
	canCreateProject: Boolean,
});

const groupedTimeEntries = computed(() => {
	const groupedEntriesByDay = {};
	for (const entry of props.timeEntries) {
		if (entry.end === null) {
			continue;
		}
		const oldEntries = groupedEntriesByDay[getLocalizedDateFromTimestamp(entry.start)];
		groupedEntriesByDay[getLocalizedDateFromTimestamp(entry.start)] = [...(oldEntries ?? []), entry];
	}
	const groupedEntriesByDayAndType = {};
	for (const dailyEntriesKey in groupedEntriesByDay) {
		const dailyEntries = groupedEntriesByDay[dailyEntriesKey];
		const newDailyEntries = [];

		for (const entry of dailyEntries) {
			const oldEntriesIndex = newDailyEntries.findIndex(
				(e) =>
					e.project_id === entry.project_id &&
					e.task_id === entry.task_id &&
					e.billable === entry.billable &&
					e.description === entry.description
			);
			if (oldEntriesIndex !== -1 && newDailyEntries[oldEntriesIndex]) {
				newDailyEntries[oldEntriesIndex].timeEntries.push(entry);

				newDailyEntries[oldEntriesIndex].duration =
					(newDailyEntries[oldEntriesIndex].duration ?? 0) + (entry?.duration ?? 0);

				if (getDayJsInstance()(entry.start).isBefore(getDayJsInstance()(newDailyEntries[oldEntriesIndex].start))) {
					newDailyEntries[oldEntriesIndex].start = entry.start;
				}
				if (getDayJsInstance()(entry.end).isAfter(getDayJsInstance()(newDailyEntries[oldEntriesIndex].end))) {
					newDailyEntries[oldEntriesIndex].end = entry.end;
				}
			} else {
				newDailyEntries.push({ ...entry, timeEntries: [entry] });
			}
		}

		groupedEntriesByDayAndType[dailyEntriesKey] = newDailyEntries;
	}
	return groupedEntriesByDayAndType;
});

function startTimeEntryFromExisting(entry) {
	props.createTimeEntry({
		project_id: entry.project_id,
		task_id: entry.task_id,
		start: getDayJsInstance().utc().format(),
		end: null,
		billable: entry.billable,
		description: entry.description,
		tags: [...entry.tags],
	});
}
function sumDuration(timeEntries) {
	return timeEntries.reduce((acc, entry) => acc + (entry?.duration ?? 0), 0);
}
function selectAllTimeEntries(value) {
	for (const timeEntry of value) {
		if ('timeEntries' in timeEntry) {
			for (const subTimeEntry of timeEntry.timeEntries) {
				selectedTimeEntries.value.push(subTimeEntry);
			}
		} else {
			selectedTimeEntries.value.push(timeEntry);
		}
	}
}

function unselectAllTimeEntries(value) {
	selectedTimeEntries.value = selectedTimeEntries.value.filter((timeEntry) => {
		return !value.find(
			(filterTimeEntry) =>
				filterTimeEntry.id === timeEntry.id ||
				filterTimeEntry.timeEntries?.find((subTimeEntry) => subTimeEntry.id === timeEntry.id)
		);
	});
}
</script>

<template>
	<div v-for="(value, key) in groupedTimeEntries" :key="key">
		<TimeEntryRowHeading
			:date="key"
			:duration="sumDuration(value)"
			:checked="value.every((timeEntry) => selectedTimeEntries.includes(timeEntry))"
			@select-all="selectAllTimeEntries(value)"
			@unselect-all="unselectAllTimeEntries(value)"
		></TimeEntryRowHeading>
		<template v-for="entry in value" :key="entry.id">
			<TimeEntryAggregateRow
				v-if="'timeEntries' in entry && entry.timeEntries.length > 1"
				:create-project
				:can-create-project
				:enable-estimated-time
				:selected-time-entries="selectedTimeEntries"
				:create-client
				:projects="projects"
				:tasks="tasks"
				:tags="tags"
				:clients
				:on-start-stop-click="startTimeEntryFromExisting"
				:update-time-entries
				:update-time-entry
				:delete-time-entries
				:create-tag
				:currency="currency"
				:time-entry="entry"
				@selected="
					(timeEntries) => {
						selectedTimeEntries = [...selectedTimeEntries, ...timeEntries];
					}
				"
				@unselected="
					(timeEntriesToUnselect) => {
						selectedTimeEntries = selectedTimeEntries.filter(
							(item) => !timeEntriesToUnselect.find((filterEntry) => filterEntry.id === item.id)
						);
					}
				"
			></TimeEntryAggregateRow>
			<TimeEntryRow
				v-else
				:create-client
				:enable-estimated-time
				:can-create-project
				:create-project
				:projects="projects"
				:selected="!!selectedTimeEntries.find((filterEntry) => filterEntry.id === entry.id)"
				:tasks="tasks"
				:tags="tags"
				:clients
				:create-tag
				:update-time-entry
				:on-start-stop-click="() => startTimeEntryFromExisting(entry)"
				:delete-time-entry="() => deleteTimeEntries([entry])"
				:currency="currency"
				:time-entry="entry.timeEntries[0]"
				@selected="selectedTimeEntries.push(entry)"
				@unselected="selectedTimeEntries = selectedTimeEntries.filter((item) => item.id !== entry.id)"
			></TimeEntryRow>
		</template>
	</div>
</template>

<style scoped></style>
