<script setup>
import { storeToRefs } from 'pinia';
import { useNotesStore } from '@/store/notes';
import TablePageView from '@/Layouts/TablePageView.vue';
import NoteForm from '@/Components/Forms/NoteForm.vue';
import NotesIcon from '@/Components/Icons/NotesIcon.vue';

const { notes } = storeToRefs(useNotesStore());
const { fetchNotes, deleteNote } = useNotesStore();

const tableColumns = [
	{ id: 'title', label: 'Titre', size: '1fr' },
	{ id: 'created_at', label: 'Créé à', size: '230px' },
	{ id: 'updated_at', label: 'Modifié à', size: '230px' },
];

const noData = {
	title: 'Aucun note trouvé',
	description: 'Créez votre premier note maintenant !',
	button: 'Créez votre premier note',
};

const dropdown = [
	{
		icon: 'edit',
		label: 'Modifier',
		onclick: (note, showForm) => showForm(note),
	},
	{
		border: true,
		icon: 'delete',
		label: 'Supprimer',
		onclick: (note) => deleteNote(note.id),
	},
];

const formatDate = (date) => {
	if (!date) return '--';
	const d = new Date(date);
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	return `${day}/${month}/${year} (${hours}:${minutes})`;
};
</script>

<template>
	<TablePageView
		title="Notes"
		create="Créer une note"
		:icon="NotesIcon"
		:data="notes"
		:modal="NoteForm"
		:columns="tableColumns"
		:dropdown="dropdown"
		:no-data="noData"
		:dropdown-min-width="150"
		@fetch="fetchNotes()"
		@rowClick="(note, showForm) => showForm(note)"
	>
		<template #title="{ data: note }">
			<span class="overflow-ellipsis overflow-hidden">{{ note.title }}</span>
		</template>

		<template #created_at="{ data: note }">
			<span class="overflow-ellipsis overflow-hidden">{{ formatDate(note.created_at) }}</span>
		</template>

		<template #updated_at="{ data: note }">
			<span class="overflow-ellipsis overflow-hidden">{{ formatDate(note.updated_at) }}</span>
		</template>
	</TablePageView>
</template>
