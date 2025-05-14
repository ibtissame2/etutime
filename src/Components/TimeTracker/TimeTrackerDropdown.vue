<script setup>
import { computed, nextTick, ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { twMerge } from 'tailwind-merge';
import { useModulesStore } from '@/store/modules';
import { PlusIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/vue/16/solid';
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component';
import Badge from '@/Components/src/Badge.vue';
import Dropdown from '@/Components/src/Input/Dropdown.vue';
import ChapitreForm from '@/Components/Forms/ChapitreForm.vue';
import ModuleForm from '@/Components/Forms/ModuleForm.vue';
import DropdownItem from '@/Components/Module/ModuleDropdownItem.vue';
import ItemBadge from '@/Components/Module/ModuleBadge.vue';

const emit = defineEmits(['change']);

const props = defineProps({
	type: String,
	value: { type: [Number, String, null], default: null },
	showBadgeBorder: { type: Boolean, default: true },
	size: { type: String, default: 'large' },
	elements: Array,
	emptyPlaceholder: { type: String, required: false },
	allowReset: { type: Boolean, default: false },
	class: { type: String, required: false },
	withModules: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
});

const { modules } = storeToRefs(useModulesStore());
const currentElement = ref(null);
const currentType = ref(props.type);
const searchInput = ref(null);
const open = ref(false);
const dropdownViewport = ref(null);
const searchValue = ref('');
const showForm = ref(false);
const mouseEnterHighlightActivated = ref(true);

const selectedElementName = computed(() => {
	if (!currentElement.value) return props.emptyPlaceholder || 'Aucun ' + props.type;
	if (props.type === currentType.value) return props.elements.find((it) => isElementSelected(it, props.type))?.name;
	else return modules.value.find((it) => isElementSelected(it, 'module'))?.name;
});

const selectedElementColor = computed(() => {
	if (props.type === currentType.value)
		return props.elements.find((it) => isElementSelected(it, props.type))?.color || 'var(--theme-color-icon-default)';
	else return modules.value.find((it) => isElementSelected(it, 'module'))?.color || 'var(--theme-color-icon-default)';
});

const searchResults = computed(() => {
	const search = searchValue.value.toLowerCase();
	if (search) return props.elements.filter((it) => it.name.toLowerCase().includes(search));
	else return props.elements;
});

function selectElement(element, type, checkIfWithModules) {
	if (props.disabled || (checkIfWithModules && !props.withModules)) return;
	currentElement.value = element?.id || null;
	currentType.value = type || null;
	open.value = false;
	searchValue.value = '';
	emit('change', currentElement.value, type);
}

function isElementSelected(element, type) {
	return currentElement.value === element.id && currentType.value === type;
}

function moveHighlightUp() {
	mouseEnterHighlightActivated.value = false;
	const currentHighlightedIndex = searchResults.value.findIndex((it) => it.id === currentElement.value);
	if (currentHighlightedIndex === 0) currentHighlightedIndex = searchResults.value.length;
	selectElement(searchResults.value[currentHighlightedIndex - 1], props.type);
}

function moveHighlightDown() {
	mouseEnterHighlightActivated.value = false;
	const currentHighlightedIndex = searchResults.value.findIndex((it) => it.id === currentElement.value);
	if (currentHighlightedIndex === searchResults.value.length - 1) currentHighlightedIndex = -1;
	selectElement(searchResults.value[currentHighlightedIndex + 1], props.type);
}

watch(open, (isOpen) => {
	if (isOpen) nextTick(() => searchInput.value?.focus({ preventScroll: true }));
});

watch(currentElement, () => {
	dropdownViewport.value
		?.querySelector(`[data-item-id="${currentElement.value}"]`)
		?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
});

watch(
	() => props.value,
	() => (currentElement.value = props.value)
);

onMounted(() => {
	currentElement.value = props.value;
});
</script>

<template>
	<div v-if="elements.length === 0">
		<Badge size="large" tag="button" class="cursor-pointer hover:bg-tertiary" @click="showForm = true">
			<PlusIcon class="-ml-1 w-5"></PlusIcon>
			<span>Ajouter une {{ type }}</span>
		</Badge>
	</div>

	<Dropdown v-else v-model="open" :close-on-content-click="false" :align="'bottom'">
		<template #trigger>
			<ItemBadge
				:color="selectedElementColor"
				:size="size"
				:border="showBadgeBorder"
				tag="button"
				:name="selectedElementName"
				:class="
					twMerge(
						'focus:border-border-tertiary w-full focus:outline-0 focus:bg-card-background-separator min-w-0 relative',
						props.class
					)
				"
			>
				<div class="flex items-center lg:space-x-1 min-w-0">
					<span class="whitespace-nowrap text-xs lg:text-sm">
						{{ selectedElementName }}
					</span>
				</div>
				<button
					v-if="currentElement && allowReset"
					class="absolute right-0 top-0 h-full flex items-center pr-3 text-text-quaternary hover:text-text-secondary"
					@click.stop="() => (selectElement(null, type), selectElement(null, 'module', true))"
				>
					<XMarkIcon class="w-5"></XMarkIcon>
				</button>
			</ItemBadge>
		</template>
		<template #content>
			<UseFocusTrap v-if="open && !disabled" :options="{ immediate: true, allowOutsideClick: true }">
				<input
					ref="searchInput"
					:value="searchValue"
					class="bg-card-background border-0 placeholder-muted text-sm text-text-primary py-2.5 focus:ring-0 border-b border-card-background-separator focus:border-card-background-separator w-full"
					:placeholder="`Rechercher ${type === 'module' ? 'un' : 'une'} ${type}...`"
					@input="(event) => (searchValue = event.target.value.trim() || '')"
					@keydown.up.prevent="moveHighlightUp"
					@keydown.down.prevent="moveHighlightDown"
				/>
				<div
					ref="dropdownViewport"
					class="min-w-[350px] max-h-[350px] overflow-y-scroll relative"
					@mousemove="mouseEnterHighlightActivated = true"
				>
					<div
						v-if="withModules"
						class="w-full pb-1 pt-2 px-2 text-text-tertiary text-xs font-semibold flex space-x-1 items-center"
					>
						<span>Chapitres</span>
					</div>
					<template v-for="it in searchResults" :key="'chapitre' + it.id">
						<div
							role="option"
							class="px-1 py-0.5 cursor-default"
							:value="it.id"
							:data-item-id="it.id"
							@click="selectElement(it, type)"
						>
							<div class="rounded-lg" :class="{ 'bg-card-background-active': isElementSelected(it, type) }">
								<DropdownItem
									:class="`hover:!bg-transparent ${type === 'chapitre' && !it.module ? 'text-text-tertiary' : ''}`"
									:selected="isElementSelected(it, type)"
									:name="type === 'chapitre' ? it.module || 'Aucun module' : it.name"
									:color="it.color || 'var(--theme-color-icon-default)'"
								>
									<template #actions>
										<div v-if="type === 'chapitre'" class="mr-2 text-text-primary">{{ it.name }}</div>
									</template>
								</DropdownItem>
							</div>
						</div>
					</template>
					<template v-if="withModules">
						<div class="w-full pb-1 pt-2 px-2 text-text-tertiary text-xs font-semibold flex space-x-1 items-center">
							<span>Modules</span>
						</div>
						<template v-for="it in modules" :key="'module' + it.id">
							<div
								role="option"
								class="px-1 py-0.5 cursor-default"
								:value="it.id"
								:data-item-id="it.id"
								@click="selectElement(it, 'module')"
							>
								<div class="rounded-lg" :class="{ 'bg-card-background-active': isElementSelected(it, 'module') }">
									<DropdownItem
										:class="`hover:!bg-transparent`"
										:selected="isElementSelected(it, 'module')"
										:name="it.name"
										:color="it.color || 'var(--theme-color-icon-default)'"
									>
									</DropdownItem>
								</div>
							</div>
						</template>
					</template>
				</div>
				<div class="hover:bg-card-background-active rounded-b-lg">
					<button
						class="text-text-primary flex space-x-3 items-center px-4 py-3 text-xs font-semibold border-t border-card-background-separator"
						@click="
							open = false;
							showForm = true;
						"
					>
						<PlusCircleIcon class="w-5 flex-shrink-0 text-icon-default"></PlusCircleIcon>
						<span>Créer une {{ type }}</span>
					</button>
				</div>
			</UseFocusTrap>
		</template>
	</Dropdown>

	<ChapitreForm v-if="type === 'chapitre'" v-model:show="showForm" />
	<ModuleForm v-if="type === 'module'" v-model:show="showForm" />
</template>

<style scoped></style>
