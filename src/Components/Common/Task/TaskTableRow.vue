<script setup>
import { CheckCircleIcon } from '@heroicons/vue/20/solid';
import { useTasksStore } from '@/utils/useTasks';
import TaskMoreOptionsDropdown from '@/Components/Common/Task/TaskMoreOptionsDropdown.vue';
import TableRow from '@/Components/TableRow.vue';
import TaskEditModal from '@/Components/Common/Task/TaskEditModal.vue';
import { ref } from 'vue';
import EstimatedTimeProgress from '@/Components/src/EstimatedTimeProgress.vue';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';

const props = defineProps({
	task: {
		type: Object,
		required: true,
	},
});

function deleteTask() {
	useTasksStore().deleteTask(props.task.id);
}

function markTaskAsDone() {
	useTasksStore().updateTask(props.task.id, {
		...props.task,
		is_done: !props.task.is_done,
	});
}

const showTaskEditModal = ref(false);
</script>

<template>
	<TableRow>
		<div
			class="whitespace-nowrap min-w-0 flex items-center space-x-5 3xl:pl-12 py-4 pr-3 text-sm font-medium text-text-primary pl-4 sm:pl-6 lg:pl-8 3xl:pl-12"
		>
			<span class="overflow-ellipsis overflow-hidden">
				{{ task.name }}
			</span>
		</div>
		<div class="whitespace-nowrap px-3 py-4 text-sm text-muted flex space-x-1 items-center font-medium">
			<span v-if="task.spent_time">
				{{ formatHumanReadableDuration(task.spent_time) }}
			</span>
			<span v-else> -- </span>
		</div>
		<div class="whitespace-nowrap px-3 flex items-center text-sm text-muted">
			<EstimatedTimeProgress v-if="task.estimated_time" :estimated="task.estimated_time" :current="task.spent_time" />
			<span v-else> -- </span>
		</div>
		<div class="whitespace-nowrap px-3 py-4 text-sm text-muted flex space-x-1 items-center font-medium">
			<template v-if="task.is_done">
				<CheckCircleIcon class="w-5" />
				<span>Done</span>
			</template>
			<template v-else>
				<span>Active</span>
			</template>
		</div>
		<div
			class="relative whitespace-nowrap flex items-center pl-3 text-right text-sm font-medium sm:pr-0 pr-4 sm:pr-6 lg:pr-8 3xl:pr-12"
		>
			<TaskMoreOptionsDropdown
				:task="task"
				@done="markTaskAsDone"
				@edit="showTaskEditModal = true"
				@delete="deleteTask"
			/>
		</div>
		<TaskEditModal v-model:show="showTaskEditModal" :task="task" />
	</TableRow>
</template>

<style scoped></style>
