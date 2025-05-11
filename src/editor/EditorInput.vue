<script setup>
import { ref, computed, watch, onMounted, onUnmounted, toRef } from 'vue';
import EditorJS from '@/editor/override-editor';

const props = defineProps({ value: Object });

const emit = defineEmits(['change']);

const internal = toRef(props.value);
const external = toRef(props.value);
const editor = ref(null);

const internationalization = {
	placeholder: 'Commencez à écrire ici...',
	messages: {
		ui: {
			blockTunes: {
				toggler: {
					'Click to tune': 'Cliquez pour ajuster',
					'or drag to move': 'ou glissez pour déplacer',
				},
			},
			toolbar: { toolbox: { Add: 'Ajouter' } },
			inlineToolbar: { converter: { 'Convert to': 'Convertir en' } },
			popover: {
				Filter: 'Filtre',
				'Nothing found': 'Aucun résultat trouvé',
				'Convert to': 'Convertir en',
			},
		},
		tools: { link: { 'Add a link': 'Ajouter un lien' } },
		blockTunes: {
			delete: {
				Delete: 'Supprimer',
				'Click to delete': 'Cliquez pour supprimer',
			},
			moveUp: { 'Move up': 'Déplacer vers le haut' },
			moveDown: { 'Move down': 'Déplacer vers le bas' },
		},
	},
};

const computedValue = computed(() => clone(internal.value));

function clone(value, _, toEmit) {
	const str = (value) => (value ? `${value}` : '');
	const blocks = value?.blocks?.map?.((block) => {
		if (!isBlockValid(block)) return;
		let data;
		const { text, level, items: i, style, content, withHeadings } = block.data || {};
		if (block.type === 'paragraph') data = { text: str(text) };
		else if (block.type === 'heading') data = { text: str(text), level: [1, 2, 3, 4].includes(level) ? level : 2 };
		else if (block.type === 'delimiter') data = { style: style === 'delimiter' ? 'delimiter' : 'divider' };
		else if (block.type === 'list') data = { items: i.map(str), style: style === 'ordered' ? 'ordered' : 'unordered' };
		else if (block.type === 'checklist')
			data = { items: i.map((it) => ({ text: str(it?.text), checked: Boolean(it?.checked) })) };
		else if (block.type === 'table')
			data = { content: content.map((i) => i.map(str)), withHeadings: Boolean(withHeadings) };
		block = data ? { id: block.id, type: block.type, data } : undefined;
		if (toEmit || typeof block.id !== 'string') delete block.id;
		return block;
	});
	value = { time: value.time, version: value.version, blocks: blocks?.filter?.(Boolean) || [] };
	if (toEmit || typeof value.time !== 'number') delete value.time;
	if (typeof value.version !== 'string') value.version = '2.30.3';
	return value;
}

function isBlockValid({ type, data } = {}) {
	if (['paragraph', 'heading', 'delimiter'].includes(type)) return true;
	if (['list', 'checklist'].includes(type)) return Array.isArray(data?.items);
	if (type === 'table') return Array.isArray(data?.content) && data.content.every(Array.isArray);
}

function areEqual({ blocks: value } = {}, { blocks: value2 } = {}) {
	const isSame = (obj1, obj2, ...attrs) => attrs.every((a) => obj1?.[a] === obj2?.[a]);
	if (!isSame(value, value2, 'length')) return false;
	return value?.every((v, i) => {
		const v2 = value2?.[i];
		if (!isBlockValid(v) || !isBlockValid(v2) || v.type !== v2.type) return false;
		if (['paragraph', 'heading', 'delimiter'].includes(v.type))
			return isSame(v.data, v2.data, 'text', 'level', 'style');
		else if (!isSame(v.data, v2.data, 'style', 'withHeadings')) return false;
		const items = v.type === 'table' ? v.data?.content : [v.data?.items];
		const items2 = v.type === 'table' ? v2.data?.content : [v2.data?.items];
		if (!isSame(items, items2, 'length')) return false;
		return items.every((item, i) => {
			if (!isSame(item, items2[i], 'length')) return false;
			return item.every((c, j) => {
				const c2 = items2[i][j];
				return v.type === 'checklist' ? isSame(c, c2, 'text', 'checked') : c === c2;
			});
		});
	});
}

watch(internal, () => {
	let value = internal.value;
	if (!areEqual(value, external.value)) {
		value = clone(value, undefined, true);
		external.value = value;
		emit('change', value);
	}
});

onMounted(async () => {
	editor.value = await EditorJS.create({
		holder: `editor-element`,
		data: computedValue.value,
		placeholder: internationalization.placeholder,
		i18n: internationalization,
		onChange: (value) => {
			value = value?.target && 'value' in value.target ? value.target.value : value;
			internal.value = clone(value);
		},
	});
});

onUnmounted(async () => {
	await editor.value?.destroy?.();
	editor.value = null;
});
</script>

<template>
	<div id="editor-element" class="w-full editor"></div>
</template>

<style scoped>
.editor {
	@apply border rounded transition-all;
	padding: 4px 11px;
	border-color: #d9d9d9;
	transition-duration: 300ms;
}

.editor:hover {
	border-color: var(--primary-color-active);
}

.error .editor,
.editor.error {
	@apply border border-danger;
}

.editor {
	background: #ffffff;
}
</style>
