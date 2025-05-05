<script setup>
import { PlusCircleIcon } from '@heroicons/vue/20/solid';
import Dropdown from '@/Components/src/Input/Dropdown.vue';
import { computed, nextTick, ref, watch } from 'vue';
import TacheForm from '@/Components/Forms/TacheForm.vue';
import MultiselectDropdownItem from '@/Components/src/Input/MultiselectDropdownItem.vue';
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component';

const props = defineProps({
	tags: Array,
	align: {
		type: String,
		default: 'bottom-start',
	},
});

const model = defineModel({ default: [] });
const searchInput = ref(null);
const open = ref(false);
const dropdownViewport = ref(null);
const searchValue = ref('');
const sortedTags = ref(props.tags);

function isTagSelected(id) {
	return model.value.includes(id);
}

function addOrRemoveTagFromSelection(id) {
	if (model.value.includes(id)) {
		model.value = model.value.filter((tagId) => tagId !== id);
	} else {
		model.value = [...model.value, id];
	}
	emit('changed');
}

watch(open, (isOpen) => {
	if (isOpen) {
		nextTick(() => {
			searchInput.value?.focus();
		});

		sortedTags.value = [...props.tags].sort((a, b) => {
			const aIsSelected = model.value.includes(a.id);
			const bIsSelected = model.value.includes(b.id);
			if (aIsSelected === bIsSelected) {
				return a.name.localeCompare(b.name);
			}
			return model.value.includes(a.id) ? -1 : 1;
		});
		nextTick(() => {
			if (filteredTags.value.length > 0) {
				highlightedItemId.value = filteredTags.value[0].id;
			}
		});
	}
});

const filteredTags = computed(() => {
	return sortedTags.value.filter((tag) => {
		return tag.name.toLowerCase().includes(searchValue.value?.toLowerCase()?.trim() || '');
	});
});

async function addTagIfNoneExists() {
	if (highlightedItemId.value) {
		addOrRemoveTagFromSelection(highlightedItemId.value);
	}
}

watch(filteredTags, () => {
	if (filteredTags.value.length > 0) {
		highlightedItemId.value = filteredTags.value[0].id;
	}
});

function updateSearchValue(event) {
	const newInput = event.target.value;
	if (newInput === ' ') {
		searchValue.value = '';
		const highlightedTagId = highlightedItemId.value;
		if (highlightedTagId) {
			const highlightedTag = props.tags.find((tag) => tag.id === highlightedTagId);
			if (highlightedTag) addOrRemoveTagFromSelection(highlightedTag.id);
		}
	} else {
		searchValue.value = newInput;
	}
}

const emit = defineEmits(['changed', 'submit']);

function toggleTag(newValue) {
	if (model.value.includes(newValue)) {
		model.value = [...model.value].filter((id) => id !== newValue);
	} else {
		model.value = [...model.value, newValue];
	}
	emit('changed');
}

function moveHighlightUp() {
	if (highlightedItem.value) {
		const currentHightlightedIndex = filteredTags.value.indexOf(highlightedItem.value);
		if (currentHightlightedIndex === 0) {
			highlightedItemId.value = filteredTags.value[filteredTags.value.length - 1].id;
		} else {
			highlightedItemId.value = filteredTags.value[currentHightlightedIndex - 1].id;
		}
	}
}

function moveHighlightDown() {
	if (highlightedItem.value) {
		const currentHightlightedIndex = filteredTags.value.indexOf(highlightedItem.value);
		if (currentHightlightedIndex === filteredTags.value.length - 1) {
			highlightedItemId.value = filteredTags.value[0].id;
		} else {
			highlightedItemId.value = filteredTags.value[currentHightlightedIndex + 1].id;
		}
	}
}

const showCreateTagModal = ref(false);
const highlightedItemId = ref(null);
const highlightedItem = computed(() => {
	return props.tags.find((tag) => tag.id === highlightedItemId.value);
});
</script>

<template>
	<TacheForm v-model:show="showCreateTagModal"></TacheForm>
	<Dropdown v-model="open" :align="align" :close-on-content-click="false" @submit="emit('submit')">
		<template #trigger>
			<slot name="trigger"></slot>
		</template>
		<template #content>
			<UseFocusTrap v-if="open" :options="{ immediate: true, allowOutsideClick: true }">
				<input
					ref="searchInput"
					:value="searchValue"
					data-testid="tag_dropdown_search"
					class="bg-card-background border-0 placeholder-muted text-sm text-text-primary py-2.5 focus:ring-0 border-b border-card-background-separator focus:border-card-background-separator w-full"
					placeholder="Rechercher une tâche..."
					@input="updateSearchValue"
					@keydown.enter="addTagIfNoneExists"
					@keydown.up.prevent="moveHighlightUp"
					@keydown.down.prevent="moveHighlightDown"
				/>
				<div ref="dropdownViewport" class="w-60 max-h-60 overflow-y-scroll">
					<div
						v-for="tag in filteredTags"
						:key="tag.id"
						role="option"
						:value="tag.id"
						:class="{ 'bg-card-background-active': tag.id === highlightedItemId }"
						data-testid="tag_dropdown_entries"
						:data-tag-id="tag.id"
					>
						<MultiselectDropdownItem
							:selected="isTagSelected(tag.id)"
							:name="tag.name"
							@click="toggleTag(tag.id)"
						></MultiselectDropdownItem>
					</div>
				</div>
				<div class="hover:bg-card-background-active rounded-b-lg">
					<button
						class="text-text-primary w-full flex space-x-3 items-center px-4 py-3 text-xs font-semibold border-t border-card-background-separator"
						@click="
							open = false;
							showCreateTagModal = true;
						"
					>
						<PlusCircleIcon class="w-5 flex-shrink-0 text-icon-default"></PlusCircleIcon>
						<span>Créer une nouvelle tâche</span>
					</button>
				</div>
			</UseFocusTrap>
		</template>
	</Dropdown>
</template>

<style scoped></style>
