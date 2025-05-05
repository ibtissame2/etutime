<script setup>
import ProjectBadge from '@/packages/ui/src/Project/ProjectBadge.vue';
import { computed, nextTick, ref, watch } from 'vue';
import { useModulesStore } from '@/store/modules';
import Dropdown from '@/packages/ui/src/Input/Dropdown.vue';
import {
	ComboboxAnchor,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxRoot,
	ComboboxViewport,
} from 'radix-vue';
import { PlusCircleIcon } from '@heroicons/vue/20/solid';
import { storeToRefs } from 'pinia';
import { usePage } from '@/utils/inertia';
import { getRandomColor } from '@/packages/ui/src/utils/color';
import ProjectDropdownItem from '@/packages/ui/src/Project/ProjectDropdownItem.vue';
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component';

const searchValue = ref('');
const searchInput = ref(null);
const model = defineModel({
	default: null,
});
const open = ref(false);
const emit = defineEmits(['update:modelValue', 'changed']);

const { modules } = storeToRefs(useModulesStore());
const projectDropdownTrigger = ref(null);
const shownModules = computed(() => {
	return modules.value.filter((module) => {
		return module.name.toLowerCase().includes(searchValue.value?.toLowerCase()?.trim() || '');
	});
});

const props = defineProps({
	border: {
		type: Boolean,
		default: true,
	},
});

const page = usePage();

async function addProjectIfNoneExists() {
	if (searchValue.value.length > 0 && shownModules.value.length === 0) {
		// Ibtissame
		// const response = await api.createProject(
		// 	{
		// 		name: searchValue.value,
		// 		color: getRandomColor(),
		// 	},
		// 	{ params: { organization: page.props.auth.user.current_team.id } }
		// );
		// modules.value.unshift(response.data);
		// model.value = response.data.id;
		// searchValue.value = '';
		// open.value = false;
	}
}

watch(open, (isOpen) => {
	if (isOpen) {
		nextTick(() => {
			searchInput.value?.$el?.focus();
		});

		modules.value.sort((iteratingProject) => {
			return model.value === iteratingProject.id ? -1 : 1;
		});
	}
});

const currentProject = computed(() => {
	return modules.value.find((project) => project.id === model.value);
});

function isModuleSelected(project) {
	return model.value === project.id;
}

const selectedProjectName = computed(() => {
	return currentProject.value?.name || 'No Project';
});

const selectedProjectColor = computed(() => {
	return currentProject.value?.color || 'var(--theme-color-icon-default)';
});

function updateValue(project) {
	model.value = project.id;
	emit('changed');
}
</script>

<template>
	<Dropdown v-model="open" align="bottom-start" width="60">
		<template #trigger>
			<ProjectBadge
				ref="projectDropdownTrigger"
				:color="selectedProjectColor"
				size="xlarge"
				:border="border"
				tag="button"
				:name="selectedProjectName"
				class="focus:border-input-border-active bg-input-background focus:outline-0 focus:bg-card-background-separator hover:bg-card-background-separator"
			></ProjectBadge>
		</template>

		<template #content>
			<UseFocusTrap v-if="open" :options="{ immediate: true, allowOutsideClick: true }">
				<ComboboxRoot
					v-model:search-term="searchValue"
					:open="open"
					:model-value="currentProject"
					class="relative"
					@update:model-value="updateValue"
				>
					<ComboboxAnchor>
						<ComboboxInput
							ref="searchInput"
							class="bg-card-background border-0 placeholder-muted text-sm text-text-primary py-2.5 focus:ring-0 border-b border-card-background-separator focus:border-card-background-separator w-full"
							placeholder="Rechercher un module..."
							@keydown.enter="addProjectIfNoneExists"
						/>
					</ComboboxAnchor>
					<ComboboxContent>
						<ComboboxViewport ref="dropdownViewport" class="w-60 max-h-60 overflow-y-scroll">
							<ComboboxItem
								v-for="project in shownModules"
								:key="project.id"
								:value="project"
								class="data-[highlighted]:bg-card-background-active"
								:data-project-id="project.id"
							>
								<ProjectDropdownItem
									:selected="isModuleSelected(project)"
									:color="project.color"
									:name="project.name"
								></ProjectDropdownItem>
							</ComboboxItem>
							<div v-if="searchValue.length > 0 && shownModules.length === 0" class="bg-card-background-active">
								<div
									class="flex space-x-3 items-center px-4 py-3 text-xs font-medium border-t rounded-b-lg border-card-background-separator"
								>
									<PlusCircleIcon class="w-5 flex-shrink-0"></PlusCircleIcon>
									<span>Add "{{ searchValue }}" as a new Project</span>
								</div>
							</div>
						</ComboboxViewport>
					</ComboboxContent>
				</ComboboxRoot>
			</UseFocusTrap>
		</template>
	</Dropdown>
</template>

<style scoped></style>
