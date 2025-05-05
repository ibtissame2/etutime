<script setup>
import Dropdown from '@/Components/src/Input/Dropdown.vue';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import SelectDropdownItem from '@/Components/src/Input/SelectDropdownItem.vue';
import { onKeyStroke } from '@vueuse/core';
import { twMerge } from 'tailwind-merge';

const model = defineModel({
	default: null,
});

const open = defineModel('open', {
	default: false,
});

const props = defineProps({
	items: {
		type: Array,
		required: true,
	},
	getKeyFromItem: {
		type: Function,
		required: true,
	},
	getNameForItem: {
		type: Function,
		required: true,
	},
	align: {
		type: String,
		default: 'bottom-start',
	},
	class: {
		type: String,
		required: false,
	},
});

const dropdownViewport = ref(null);
const searchValue = ref('');
const highlightedItemId = ref(model.value);

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

function resetHightlightedItem() {
	if (
		filteredItems.value.length > 0 &&
		filteredItems.value.find((item) => props.getKeyFromItem(item) === highlightedItemId.value) === undefined
	) {
		highlightedItemId.value = props.getKeyFromItem(filteredItems.value[0]);
	}
}

watch(model, () => {
	if (model.value) {
		highlightedItemId.value = model.value;
	}
});

watch(filteredItems, resetHightlightedItem);

watch(highlightedItemId, () => {
	if (highlightedItemId.value) {
		const highlightedDomElement = dropdownViewport.value?.querySelector(
			`[data-select-id="${highlightedItemId.value}"]`
		);
		highlightedDomElement?.scrollIntoView({
			block: 'nearest',
			inline: 'nearest',
		});
	}
});

watch(open, () => {
	if (open.value === true) {
		nextTick(() => {
			const highlightedDomElement = dropdownViewport.value?.querySelector(`[data-select-id="${model.value}"]`);
			dropdownViewport.value?.scrollTo({
				top: highlightedDomElement?.offsetTop ?? 0,
				behavior: 'instant',
			});
		});
	}
});

onMounted(resetHightlightedItem);

const emit = defineEmits(['update:modelValue', 'changed']);

function setItem(newValue) {
	model.value = newValue;
	emit('changed');
	open.value = false;
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

onKeyStroke('ArrowDown', (e) => {
	if (open.value === true) {
		moveHighlightDown();
		e.preventDefault();
	}
});

onKeyStroke('ArrowUp', (e) => {
	if (open.value === true) {
		moveHighlightUp();
		e.preventDefault();
	}
});

onKeyStroke('Enter', (e) => {
	if (open.value === true) {
		setItem(highlightedItemId.value);
		e.preventDefault();
	}
});
</script>

<template>
	<Dropdown v-model="open" :align="align" :close-on-content-click="false">
		<template #trigger>
			<slot name="trigger"></slot>
		</template>
		<template #content>
			<div ref="dropdownViewport" :class="twMerge('w-60 py-1.5 max-h-60 overflow-y-scroll', props.class)">
				<div
					v-for="item in filteredItems"
					:key="props.getKeyFromItem(item) ?? 'none'"
					role="option"
					:data-select-id="props.getKeyFromItem(item)"
					:value="props.getKeyFromItem(item)"
					:data-item-id="props.getKeyFromItem(item)"
				>
					<SelectDropdownItem
						:highlighted="props.getKeyFromItem(item) === highlightedItemId"
						:selected="props.getKeyFromItem(item) === model"
						:name="props.getNameForItem(item)"
						@mouseenter="highlightedItemId = props.getKeyFromItem(item)"
						@click="setItem(props.getKeyFromItem(item))"
					/>
				</div>
			</div>
		</template>
	</Dropdown>
</template>

<style scoped></style>
