<script setup>
import Dropdown from '@/packages/ui/src/Input/Dropdown.vue';
import { computed, nextTick, ref, watch } from 'vue';
import MultiselectDropdownItem from '@/packages/ui/src/Input/MultiselectDropdownItem.vue';

const model = defineModel({ default: [] });

const props = defineProps({
	items: Array,
	searchPlaceholder: String,
	getKeyFromItem: Function,
	getNameForItem: Function,
});

const searchInput = ref(null);
const open = ref(false);
const dropdownViewport = ref(null);
const searchValue = ref('');
const highlightedItemId = ref(null);

const emit = defineEmits(['update:modelValue', 'changed']);

function isItemSelected(id) {
	return model.value.includes(id);
}

function addOrRemoveItemFromSelection(id) {
	if (model.value.includes(id)) {
		model.value = model.value.filter((itemId) => itemId !== id);
	} else {
		model.value.push(id);
	}
	emit('changed');
}

watch(open, (isOpen) => {
	if (isOpen) {
		nextTick(() => {
			searchInput.value?.focus();
		});

		[...props.items].sort((a, b) => {
			const aIsSelected = model.value.includes(props.getKeyFromItem(a));
			const bIsSelected = model.value.includes(props.getKeyFromItem(b));
			if (aIsSelected === bIsSelected) {
				return props.getNameForItem(a).localeCompare(props.getNameForItem(b));
			}
			return model.value.includes(props.getKeyFromItem(a)) ? -1 : 1;
		});

		nextTick(() => {
			if (filteredItems.value.length > 0) {
				highlightedItemId.value = props.getKeyFromItem(filteredItems.value[0]);
			}
		});
	}
});

const filteredItems = computed(() => {
	return props.items.filter((item) => {
		return props
			.getNameForItem(item)
			.toLowerCase()
			.includes(searchValue.value?.toLowerCase()?.trim() || '');
	});
});

const highlightedItem = computed(() => {
	return props.items.find((item) => props.getKeyFromItem(item) === highlightedItemId.value);
});

watch(filteredItems, () => {
	if (filteredItems.value.length > 0) {
		highlightedItemId.value = props.getKeyFromItem(filteredItems.value[0]);
	}
});

function updateSearchValue(event) {
	const newInput = event.target.value;
	if (newInput === ' ') {
		searchValue.value = '';
		const highlightedTagId = highlightedItemId.value;
		if (highlightedTagId) {
			const highlightedItem = props.items.find((item) => props.getKeyFromItem(item) === highlightedTagId);
			if (highlightedItem) {
				addOrRemoveItemFromSelection(props.getKeyFromItem(highlightedItem));
			}
		}
	} else {
		searchValue.value = newInput;
	}
}

function toggleItem(newValue) {
	if (newValue !== null) {
		if (model.value.includes(newValue)) {
			model.value = [...model.value].filter((id) => id !== newValue);
		} else {
			model.value = [...model.value, newValue];
		}
		emit('changed');
	}
}

function moveHighlightUp() {
	if (highlightedItem.value) {
		const currentHightlightedIndex = filteredItems.value.indexOf(highlightedItem.value);
		if (currentHightlightedIndex === 0) {
			highlightedItemId.value = props.getKeyFromItem(filteredItems.value[filteredItems.value.length - 1]);
		} else {
			highlightedItemId.value = props.getKeyFromItem(filteredItems.value[currentHightlightedIndex - 1]);
		}
	}
}

function moveHighlightDown() {
	if (highlightedItem.value) {
		const currentHightlightedIndex = filteredItems.value.indexOf(highlightedItem.value);
		if (currentHightlightedIndex === filteredItems.value.length - 1) {
			highlightedItemId.value = props.getKeyFromItem(filteredItems.value[0]);
		} else {
			highlightedItemId.value = props.getKeyFromItem(filteredItems.value[currentHightlightedIndex + 1]);
		}
	}
}
</script>

<template>
	<Dropdown v-model="open" align="bottom-start" :close-on-content-click="false">
		<template #trigger>
			<slot name="trigger"></slot>
		</template>
		<template #content>
			<input
				ref="searchInput"
				:value="searchValue"
				class="bg-card-background border-0 placeholder-muted text-sm text-text-primary py-2.5 focus:ring-0 border-b border-card-background-separator focus:border-card-background-separator w-full"
				:placeholder="searchPlaceholder"
				@input="updateSearchValue"
				@keydown.up.prevent="moveHighlightUp"
				@keydown.down.prevent="moveHighlightDown"
				@keydown.enter="toggleItem(highlightedItemId)"
			/>
			<div ref="dropdownViewport" class="min-w-60 max-w-80 max-h-60 overflow-y-scroll">
				<div
					v-for="item in filteredItems"
					:key="props.getKeyFromItem(item)"
					role="option"
					:value="props.getKeyFromItem(item)"
					:class="{
						'bg-card-background-active': props.getKeyFromItem(item) === highlightedItemId,
					}"
					:data-item-id="props.getKeyFromItem(item)"
				>
					<MultiselectDropdownItem
						:selected="isItemSelected(props.getKeyFromItem(item))"
						:name="props.getNameForItem(item)"
						@click="toggleItem(props.getKeyFromItem(item))"
					/>
				</div>
			</div>
		</template>
	</Dropdown>
</template>

<style scoped></style>
