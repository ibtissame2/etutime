<script setup>
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge';
import { useModulesStore } from '@/store/modules';
import { storeToRefs } from 'pinia';
import ModuleBadge from '@/Components/Module/ModuleBadge.vue';

const { modules } = storeToRefs(useModulesStore());

const props = defineProps({
	chapitre: Object,
	highlighted: Boolean,
});

const module = computed(() => {
	return modules.value?.find((iteratingProject) => iteratingProject.id === props.chapitre.module_id);
});
</script>

<template>
	<button
		tabindex="-1"
		:data-select-id="chapitre.id"
		:class="
			twMerge(
				'px-2 py-1.5 flex justify-between items-center space-x-2 w-full rounded',
				props.highlighted && 'bg-card-background-active'
			)
		"
	>
		<span :class="`text-sm font-medium ${chapitre.name ? '' : 'text-text-tertiary'}`">
			{{ chapitre.name || 'Aucun chapitre' }}
		</span>
		<ModuleBadge ref="projectDropdownTrigger" :color="module?.color" :name="module?.name" class="">
			<div v-if="module" class="flex items-center lg:space-x-1 min-w-0">
				<span class="whitespace-nowrap text-xs">
					{{ module?.name }}
				</span>
			</div>
			<div v-else class="text-text-tertiary">Aucun module</div>
		</ModuleBadge>
	</button>
</template>

<style scoped></style>
