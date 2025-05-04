<script setup>
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';
import { PlusIcon } from '@heroicons/vue/16/solid';
import { ref } from 'vue';
import TaskTableRow from '@/Components/Common/Task/TaskTableRow.vue';
import TaskTableHeading from '@/Components/Common/Task/TaskTableHeading.vue';
import TaskCreateModal from '@/Components/Common/Task/TaskCreateModal.vue';

const props = defineProps({
	projectId: {
		type: String,
		required: true,
	},
	tasks: {
		type: Array,
		required: true,
	},
});

const createTask = ref(false);
</script>

<template>
	<TaskCreateModal v-model:show="createTask" :project-id="props.projectId" />
	<div class="flow-root">
		<div class="inline-block min-w-full align-middle">
			<div
				data-testid="task_table"
				role="table"
				class="grid min-w-full"
				style="grid-template-columns: 1fr minmax(80px, auto) minmax(120px, auto) minmax(50px, auto) 80px"
			>
				<TaskTableHeading />
				<div v-if="tasks.length === 0" class="col-span-5 py-24 text-center">
					<PlusCircleIcon class="w-8 text-icon-default inline pb-2" />
					<h3 class="text-text-primary font-semibold">No tasks found</h3>
					<p class="pb-5">Create your first task now!</p>
					<SecondaryButton :icon="PlusIcon" @click="createTask = true"> Create your First Task </SecondaryButton>
				</div>
				<template v-for="task in tasks" :key="task.id">
					<TaskTableRow :task="task" />
				</template>
			</div>
		</div>
	</div>
</template>
