<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { formatHumanReadableDuration, formatStartEnd } from '@/Components/src/utils/time';
import { useModulesStore } from '@/store/modules';
import { useTachesStore } from '@/store/taches';
import { TrashIcon } from '@heroicons/vue/20/solid';
import Dropdown from '@/Components/src/Input/Dropdown.vue';
import TimeRangeSelector from '@/Components/src/Input/TimeRangeSelector.vue';
import MainContainer from '@/Components/src/MainContainer.vue';
import TimeTrackerStartStop from '@/Components/TimeTracker/TimeTrackerStartStop.vue';
import TimeTrackerTagDropdown from '@/Components/TimeTracker/TimeTrackerTagDropdown.vue';
import Checkbox from '@/Components/src/Input/Checkbox.vue';
import GroupedItemsCountButton from '@/Components/src/GroupedItemsCountButton.vue';
import MoreOptionsDropdown from '@/Components/src/MoreOptionsDropdown.vue';

const { modules } = storeToRefs(useModulesStore());
const { taches } = storeToRefs(useTachesStore());

const props = defineProps({
	minuteur: Object,
	aggregate: Object,
	selected: Boolean,
	indent: { type: Boolean, default: false },
	expandable: { type: Boolean, default: false },
});

const emit = defineEmits(['selecte', 'unselecte', 'start-stop-click', 'delete']);

const module = computed(() => modules.value.find((module) => module.id === props.minuteur.module_id));

const expanded = ref(false);
const startEndRangeOpen = ref(false);
const temporaryDuration = ref('');
const durationInputOpen = ref(false);

const durationInputValue = computed({
	get() {
		if (temporaryDuration.value !== '') return temporaryDuration.value;
		return formatHumanReadableDuration(props.minuteur.duration);
	},
	set(newValue) {
		durationInputOpen.value = true;
		temporaryDuration.value = newValue || '';
	},
});

watch(
	() => props.expandable,
	(value) => !value && (expanded.value = false)
);
</script>

<template>
	<div
		class="border-b border-default-background-separator bg-row-background min-w-0 transition"
		data-testid="time_entry_row"
	>
		<MainContainer class="min-w-0">
			<div class="sm:flex py-2 items-center min-w-0 justify-between group">
				<div class="flex space-x-3 items-center min-w-0">
					<Checkbox :checked="selected" @update:checked="(checked) => emit(checked ? 'selecte' : 'unselecte')" />
					<div v-if="indent === true" class="w-10 h-7"></div>
					<div class="flex items-center min-w-0">
						<GroupedItemsCountButton v-if="expandable" :expanded="expanded" @click="expanded = !expanded">
							{{ aggregate.sublist.length }}
						</GroupedItemsCountButton>
						<div class="mr-2 text-ellipsis whitespace-nowrap overflow-hidden max-w-52">
							<div class="text-sm whitespace-pre font-medium pr-1" :class="{ 'pl-3': expandable }">
								<span v-if="minuteur.chapitre_name"> {{ minuteur.chapitre_name }}</span>
								<span v-else class="text-text-tertiary">Aucun chapitre</span>
							</div>
						</div>
						<div
							class="text-sm border-input-border text-ellipsis p-1 px-3 whitespace-nowrap overflow-hidden max-w-52"
							style="border-width: 1px; border-radius: 6px"
						>
							<div
								:style="{ backgroundColor: module?.color || 'var(--theme-color-icon-default)' }"
								class="w-2.5 h-2.5 mr-1 inline-block rounded-full shrink-0"
							></div>
							<span v-if="module?.name">{{ module.name }}</span>
							<span v-else class="text-text-tertiary">Aucun module</span>
						</div>
					</div>
				</div>
				<div class="flex items-center font-medium lg:space-x-2">
					<TimeTrackerTagDropdown disabled :taches="taches" :model-value="minuteur.taches"></TimeTrackerTagDropdown>
					<div class="flex-1">
						<button
							v-if="expandable"
							class="text-muted w-[110px] px-1 py-1.5 bg-transparent text-center hover:bg-card-background rounded-lg border border-transparent hover:border-card-border text-sm font-medium focus-visible:outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-tertiary"
							@click="expanded = !expanded"
						>
							{{ formatStartEnd(minuteur.start, minuteur.end) }}
						</button>
						<div v-else class="relative">
							<Dropdown
								v-model="startEndRangeOpen"
								:align="'bottom'"
								:close-on-content-click="false"
								@submit="startEndRangeOpen = false"
							>
								<template #trigger>
									<button
										data-testid="time_entry_range_selector"
										class="text-muted w-[110px] px-2 bg-transparent text-center hover:bg-card-background rounded-lg border border-transparent hover:border-card-border focus-visible:outline-none focus:outline-none focus-visible:ring-2 focus-visible:text-text-primary focus-visible:ring-ring focus-visible:bg-tertiary text-sm py-1.5 font-medium"
										:class="{ 'border-card-border bg-card-background': startEndRangeOpen }"
										:disabled="!!minuteur.start && !minuteur.end"
									>
										{{ formatStartEnd(minuteur.start, minuteur.end) }}
									</button>
								</template>
								<template #content>
									<TimeRangeSelector
										focus
										:start="minuteur.start"
										:end="minuteur.end"
										@close="startEndRangeOpen = false"
									/>
								</template>
							</Dropdown>
						</div>
					</div>
					<button
						v-if="expandable"
						class="text-text-primary min-w-[90px] px-2 py-1.5 bg-transparent text-center hover:bg-card-background rounded-lg border border-transparent hover:border-card-border text-sm font-semibold focus-visible:outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-tertiary"
						@click="expanded = !expanded"
					>
						{{ formatHumanReadableDuration(aggregate.duration) }}
					</button>
					<input
						v-else
						v-model="durationInputValue"
						:disabled="!!minuteur.start && !minuteur.end"
						data-testid="time_entry_duration_input"
						class="text-text-primary w-[90px] px-2 py-1.5 bg-transparent text-center hover:bg-card-background rounded-lg border border-transparent hover:border-card-border text-sm font-semibold focus-visible:bg-tertiary focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-ring"
						@focus="durationInputOpen = true"
						@keydown.tab="durationInputOpen = false"
					/>
					<TimeTrackerStartStop
						:active="!!minuteur.start && !minuteur.end"
						class="opacity-20 hidden sm:flex group-hover:opacity-100 focus-visible:opacity-100"
						@changed="emit('start-stop-click')"
					></TimeTrackerStartStop>
					<MoreOptionsDropdown label="Actions for the time entry">
						<button
							data-testid="time_entry_delete"
							class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
							@click="emit('delete')"
						>
							<TrashIcon class="w-5 text-icon-active"></TrashIcon>
							<span>Supprimer</span>
						</button>
					</MoreOptionsDropdown>
				</div>
			</div>
		</MainContainer>
		<div v-if="expanded" class="w-full border-t border-default-background-separator bg-black/15">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped></style>
