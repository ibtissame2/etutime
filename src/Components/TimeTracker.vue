<script setup>
import { ClockIcon } from '@heroicons/vue/20/solid';
import CardTitle from '@/packages/ui/src/CardTitle.vue';
import { usePage } from '@/utils/inertia';
import { computed, onMounted, watch } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import { useCurrentTimeEntryStore } from '@/utils/useCurrentTimeEntry';
import { storeToRefs } from 'pinia';
import { getCurrentOrganizationId } from '@/utils/useUser';
import { switchOrganization } from '@/utils/useOrganization';
import { useModulesStore } from '@/store/modules';
import { useTachesStore } from '@/store/taches';
import { useTasksStore } from '@/utils/useTasks';
import { useClientsStore } from '@/utils/useClients';
import TimeTrackerControls from '@/packages/ui/src/TimeTracker/TimeTrackerControls.vue';
import TimeTrackerRunningInDifferentOrganizationOverlay from '@/packages/ui/src/TimeTracker/TimeTrackerRunningInDifferentOrganizationOverlay.vue';

const page = usePage();
dayjs.extend(duration);
dayjs.extend(utc);

const currentTimeEntryStore = useCurrentTimeEntryStore();
const { currentTimeEntry, isActive, now } = storeToRefs(currentTimeEntryStore);
const { startLiveTimer, stopLiveTimer, setActiveState } = currentTimeEntryStore;

const { modules } = storeToRefs(useModulesStore());
const taskStore = useTasksStore();
const { tasks } = storeToRefs(taskStore);
const clientStore = useClientsStore();
const { clients } = storeToRefs(clientStore);

const emit = defineEmits(['change']);

watch(isActive, () => {
	if (isActive.value) {
		startLiveTimer();
	} else {
		stopLiveTimer();
	}
	emit('change');
});

onMounted(async () => {
	if (page.props.auth.user.current_team.id) {
		await currentTimeEntryStore.fetchCurrentTimeEntry();
		now.value = dayjs().utc();
	}
});

function updateTimeEntry() {
	if (currentTimeEntry.value.id) {
		useCurrentTimeEntryStore().updateTimer();
	}
}

const isRunningInDifferentOrganization = computed(() => {
	return (
		currentTimeEntry.value.organization_id &&
		getCurrentOrganizationId() &&
		currentTimeEntry.value.organization_id !== getCurrentOrganizationId()
	);
});

function switchToTimeEntryOrganization() {
	if (currentTimeEntry.value.organization_id) {
		switchOrganization(currentTimeEntry.value.organization_id);
	}
}

const { taches } = storeToRefs(useTachesStore());
</script>

<template>
	<CardTitle title="Suivi du temps" :icon="ClockIcon"></CardTitle>
	<div class="relative">
		<TimeTrackerRunningInDifferentOrganizationOverlay
			v-if="isRunningInDifferentOrganization"
			@switch-organization="switchToTimeEntryOrganization"
		>
		</TimeTrackerRunningInDifferentOrganizationOverlay>

		<TimeTrackerControls
			:projects="modules"
			:tasks="tasks"
			:tags="taches"
			:clients="clients"
			:is-active="isActive"
			v-model:current-time-entry="currentTimeEntry"
			v-model:live-timer="now"
			@start-live-timer="startLiveTimer"
			@stop-live-timer="stopLiveTimer"
			@start-timer="setActiveState(true)"
			@stop-timer="setActiveState(false)"
			@update-time-entry="updateTimeEntry"
		>
		</TimeTrackerControls>
	</div>
</template>
