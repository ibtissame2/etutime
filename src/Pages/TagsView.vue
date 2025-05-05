<script setup>
import { storeToRefs } from 'pinia';
import { useTachesStore } from '@/store/taches';
import TablePageView from '@/Layouts/TablePageView.vue';
import TacheForm from '@/Components/Forms/TacheForm.vue';
import TagIcon from '@/Components/Icons/TagIcon.vue';

const { taches } = storeToRefs(useTachesStore());
const { fetchTaches, deleteTache } = useTachesStore();

const noData = {
	title: 'Aucun tâche trouvé',
	description: 'Créez votre premier tâche maintenant !',
	button: 'Créez votre premier tâche',
};

const dropdown = [
	{
		icon: 'delete',
		label: 'Supprimer',
		onclick: (tache) => deleteTache(tache.id),
	},
];
</script>

<template>
	<TablePageView
		title="Tâches"
		create="Créer une tâche"
		:icon="TagIcon"
		:data="taches"
		:columns="['Nom']"
		:modal="TacheForm"
		:dropdown="dropdown"
		:no-data="noData"
		@fetch="fetchTaches()"
	>
		<template #Nom="{ data: tache }">{{ tache.name }}</template>
	</TablePageView>
</template>
