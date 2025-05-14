<script setup>
import { ref } from 'vue';
import { useFocus } from '@vueuse/core';
import { useNotesStore } from '@/store/notes';
import DialogModal from '@/Components/src/DialogModal.vue';
import InputLabel from '@/Components/src/Input/InputLabel.vue';
import TextInput from '@/Components/src/Input/TextInput.vue';
import EditorInput from '@/Components/Editor/EditorInput.vue';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import PrimaryButton from '@/Components/src/Buttons/PrimaryButton.vue';

const { createNote, updateNote } = useNotesStore();

const show = defineModel('show', { default: false });
const loading = ref(false);
const note = ref({});

const extractData = (note) => {
	const content = note?.content || { blocks: [] };
	return {
		id: note?.id,
		title: note?.title || '',
		content: content,
	};
};

const clearData = () => {
	note.value = extractData(null);
	show.value = false;
};

function setDataOf(element) {
	note.value = extractData(element || null);
	show.value = true;
}

async function submit() {
	loading.value = true;
	if (note.value.id) await updateNote(note.value.id, note.value, () => clearData());
	else await createNote(note.value, () => clearData());
	loading.value = false;
}

const titleInput = ref(null);
const editorInput = ref(null);
useFocus(titleInput, { initialValue: true });

defineExpose({ setDataOf });
</script>

<template>
	<DialogModal closeable :show="show" @close="clearData()">
		<template #title>
			<div class="flex space-x-2">
				<span>{{ note.id ? 'Modifier la note' : 'Créer une note' }}</span>
			</div>
		</template>

		<template #content>
			<div class="space-y-2">
				<div class="w-full">
					<InputLabel for="noteTitle" value="Nom du note" />
					<TextInput
						id="noteTitle"
						ref="titleInput"
						v-model="note.title"
						type="text"
						placeholder="Nom du note"
						class="mt-1 block w-full"
						required
						@keydown.enter="submit()"
					/>
				</div>

				<div class="w-full">
					<InputLabel for="noteContent" value="Contenu" class="mb-1" />
					<EditorInput ref="editorInput" :value="note.content" @change="(v) => (note.content = v)" />
				</div>
			</div>
		</template>

		<template #footer>
			<SecondaryButton @click="clearData()">Annuler</SecondaryButton>
			<PrimaryButton class="ms-3" :class="{ 'opacity-25': loading }" :disabled="loading" @click="submit">
				{{ note.id ? 'Modifier' : 'Créer' }}
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
