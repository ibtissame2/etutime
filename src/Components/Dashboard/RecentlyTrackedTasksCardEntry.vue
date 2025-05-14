<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import ModuleBadge from '@/Components/Module/ModuleBadge.vue';
import TimeTrackerStartStop from '@/Components/TimeTracker/TimeTrackerStartStop.vue';
import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
import { useTimersStore } from '@/store/timers';
import { getDayJsInstance } from '@/Components/src/utils/time';
import { ChevronRightIcon } from '@heroicons/vue/16/solid';

const props = defineProps({
	timeEntry: Object,
});

const { modules } = storeToRefs(useModulesStore());
const { chapitres } = storeToRefs(useChapitresStore());
const { currentTimer } = storeToRefs(useTimersStore());
const { setActiveState } = useTimersStore();

const module = computed(() => {
	return modules.value.find((module) => module.id === props.timeEntry.module_id);
});

async function startTaskTimer() {
	if (currentTimer.value?.id) await setActiveState(false, currentTimer.value);
	await setActiveState(true, { ...props.timeEntry, id: undefined });
}
</script>

<template>
	<div class="px-3.5 py-2 grid grid-cols-5 border-b border-b-card-background-separator">
		<div class="col-span-4">
			<p class="font-medium text-text-primary text-sm pb-1 truncate">
				<span v-if="timeEntry.chapitre_name"> {{ timeEntry.chapitre_name }}</span>
				<span v-else class="text-text-tertiary">Aucun chapitre</span>
			</p>
			<ModuleBadge size="base" class="min-w-0 max-w-full" :color="module?.color">
				<div class="flex items-center lg:space-x-0.5 min-w-0">
					<span class="whitespace-nowrap">
						<span v-if="module?.name"> {{ module.name }}</span>
						<span v-else class="text-text-tertiary">Aucun module</span>
					</span>
				</div>
			</ModuleBadge>
		</div>
		<div class="flex items-center justify-center">
			<TimeTrackerStartStop @changed="startTaskTimer"></TimeTrackerStartStop>
		</div>
	</div>
</template>
