<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import ModuleBadge from '@/Components/Module/ModuleBadge.vue';
import TimeTrackerStartStop from '@/Components/TimeTracker/TimeTrackerStartStop.vue';
import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
// import { useCurrentTimerStore } from '@/store/current-timer';
import { getDayJsInstance } from '@/Components/src/utils/time';
import { ChevronRightIcon } from '@heroicons/vue/16/solid';

const props = defineProps({
	timeEntry: Object,
});

const { modules } = storeToRefs(useModulesStore());
const { chapitres } = storeToRefs(useChapitresStore());
// const { currentTimer } = storeToRefs(useCurrentTimerStore());
// const { setActiveState, fetchCurrentTimeEntry } = useCurrentTimerStore();

const project = computed(() => {
	return modules.value.find((module) => module.id === props.timeEntry.project_id);
});

const task = computed(() => {
	return chapitres.value.find((task) => task.id === props.timeEntry.task_id);
});

async function startTaskTimer() {
	if (currentTimer.value) await setActiveState(false, currentTimer.value);
	// // Ibtissame: set the new entry as the current one
	// currentTimer.value = currentTimer.value || {};
	// currentTimer.value.module_id = props.timeEntry.module_id;
	// currentTimer.value.chapitre_id = props.timeEntry.chapitre_id;
	// currentTimer.value.chapitre_name = props.timeEntry.chapitre_name;
	// currentTimer.value.taches = props.timeEntry.taches;
	// currentTimer.value.start = getDayJsInstance().utc().format();
	// await setActiveState(true, props.timeEntry);
	// fetchCurrentTimeEntry();
}
</script>

<template>
	<div class="px-3.5 py-2 grid grid-cols-5 border-b border-b-card-background-separator">
		<div class="col-span-4">
			<p class="font-medium text-text-primary text-sm pb-1 truncate">
				<span v-if="timeEntry.description"> {{ timeEntry.description }}</span>
				<span v-else class="text-text-tertiary">No description</span>
			</p>
			<ModuleBadge size="base" class="min-w-0 max-w-full" :color="project?.color">
				<div class="flex items-center lg:space-x-0.5 min-w-0">
					<span class="whitespace-nowrap">
						{{ project?.name ?? 'No Project' }}
					</span>
					<ChevronRightIcon v-if="task" class="w-4 text-muted shrink-0"></ChevronRightIcon>
					<div v-if="task" class="min-w-0 shrink truncate">
						{{ task.name }}
					</div>
				</div>
			</ModuleBadge>
		</div>
		<div class="flex items-center justify-center">
			<TimeTrackerStartStop @changed="startTaskTimer"></TimeTrackerStartStop>
		</div>
	</div>
</template>
