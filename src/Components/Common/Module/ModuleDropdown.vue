<script setup>
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useModulesStore } from '@/store/modules';
import { PlusCircleIcon } from '@heroicons/vue/20/solid';
import { getRandomColor } from '@/packages/ui/src/utils/color';
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component';
import { ComboboxAnchor, ComboboxContent, ComboboxInput } from 'radix-vue';
import { ComboboxItem, ComboboxRoot, ComboboxViewport } from 'radix-vue';
import ProjectBadge from '@/packages/ui/src/Project/ProjectBadge.vue';
import Dropdown from '@/packages/ui/src/Input/Dropdown.vue';
import ProjectDropdownItem from '@/packages/ui/src/Project/ProjectDropdownItem.vue';

const props = defineProps({
	value: {
		type: [Number, null],
		default: null,
	},
	border: {
		type: Boolean,
		default: true,
	},
	small: {
		type: Boolean,
		default: false,
	},
	full: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue', 'change']);

const { modules } = storeToRefs(useModulesStore());
const { createModule } = useModulesStore();

const model = defineModel({ default: null });

const searchValue = ref('');
const searchInput = ref(null);
const open = ref(false);

const shownModules = computed(() => {
	return modules.value.filter((module) => {
		return module.name.toLowerCase().includes(searchValue.value?.toLowerCase()?.trim() || '');
	});
});

const isModuleSelected = (module) => model.value === module.id;
const updateValue = (module) => {
	model.value = module.id || null;
	emit('change', model.value);
};
const current = computed(() => modules.value.find((module) => module.id === model.value));

async function addModuleIfNoneExists() {
	if (searchValue.value.length > 0 && shownModules.value.length === 0) {
		const response = await createModule({ name: searchValue.value, color: getRandomColor() });
		await response.featching;
		if (response.id) {
			model.value = response.id;
			emit('change', model.value);
			searchValue.value = '';
			open.value = false;
		}
	}
}

watch(open, (isOpen) => {
	if (!isOpen) return;
	nextTick(() => searchInput.value?.$el?.focus());
	modules.value.sort((module) => (model.value === module.id ? -1 : 1));
});

onMounted(() => (model.value = props.value));
</script>

<template>
	<Dropdown v-model="open" align="bottom-start" width="60">
		<template #trigger>
			<ProjectBadge
				:color="current?.color || 'var(--theme-color-icon-default)'"
				:size="small ? 'base' : full ? 'xlargeFull' : 'xlarge'"
				:border="border"
				tag="button"
				:name="current?.name || 'Aucun Module'"
				class="focus:border-input-border-active bg-input-background focus:outline-0 focus:bg-card-background-separator hover:bg-card-background-separator"
			></ProjectBadge>
		</template>

		<template #content>
			<UseFocusTrap v-if="open" :options="{ immediate: true, allowOutsideClick: true }">
				<ComboboxRoot
					v-model:search-term="searchValue"
					:open="open"
					:model-value="current"
					class="relative"
					@update:model-value="updateValue"
				>
					<ComboboxAnchor>
						<ComboboxInput
							ref="searchInput"
							class="bg-card-background border-0 placeholder-muted text-sm text-text-primary py-2.5 focus:ring-0 border-b border-card-background-separator focus:border-card-background-separator w-full"
							placeholder="Rechercher un module..."
							@keydown.enter="addModuleIfNoneExists"
						/>
					</ComboboxAnchor>
					<ComboboxContent>
						<ComboboxViewport ref="dropdownViewport" class="w-60 max-h-60 overflow-y-scroll">
							<ComboboxItem
								v-for="module in shownModules"
								:key="module.id"
								:value="module"
								class="data-[highlighted]:bg-card-background-active"
								:data-project-id="module.id"
							>
								<ProjectDropdownItem
									:selected="isModuleSelected(module)"
									:color="module.color"
									:name="module.name"
								></ProjectDropdownItem>
							</ComboboxItem>
							<div v-if="searchValue.length > 0 && shownModules.length === 0" class="bg-card-background-active">
								<div
									class="flex space-x-3 items-center px-4 py-3 text-xs font-medium border-t rounded-b-lg border-card-background-separator"
								>
									<PlusCircleIcon class="w-5 flex-shrink-0"></PlusCircleIcon>
									<span>Ajouter "{{ searchValue }}" comme un nouveau module</span>
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
