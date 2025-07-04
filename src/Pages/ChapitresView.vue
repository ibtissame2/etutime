<script setup>
import { storeToRefs } from 'pinia';
import { useChapitresStore } from '@/store/chapitres';
import { useMinuteursStore } from '@/store/minuteurs';
import { formatHumanReadableDuration } from '@/Components/src/utils/time';
import TablePageView from '@/Layouts/TablePageView.vue';
import ChapitreForm from '@/Components/Forms/ChapitreForm.vue';
import ModuleDropdown from '@/Components/Module/ModuleDropdown.vue';
import BookCheckIcon from '@/Components/Icons/BookCheckIcon.vue';
import DoneIcon from '@/Components/Icons/DoneIcon.vue';

const { minuteurs } = storeToRefs(useMinuteursStore());
const { chapitres } = storeToRefs(useChapitresStore());
const { fetchChapitres, updateChapitre, deleteChapitre } = useChapitresStore();

const tableColumns = [
	{ id: 'status', label: ' ', size: '65px' },
	{ id: 'name', label: 'Nom', size: '0.5fr' },
	{ id: 'module', label: 'Module', size: '0.7fr' },
	{ id: 'time', label: 'Durée totale', size: '140px' },
];

const noData = {
	title: 'Aucun chapitre trouvé',
	description: 'Créez votre premier chapitre maintenant !',
	button: 'Créez votre premier chapitre',
};

const dropdown = [
	{
		icon: 'edit',
		label: 'Modifier',
		onclick: (chapitre, showForm) => showForm(chapitre),
	},
	{
		border: true,
		icon: 'delete',
		label: 'Supprimer',
		onclick: (chapitre) => deleteChapitre(chapitre.id),
	},
];

function getTotalTimeForChapitre(chapitre) {
	let total = 0;
	minuteurs.value.forEach((minuteur) => {
		if (minuteur.end && chapitre.id === minuteur.chapitre_id) total += minuteur.duration;
	});
	return total ? formatHumanReadableDuration(total) : '--';
}
</script>

<template>
	<TablePageView
		title="Chapitres"
		create="Créer une chapitre"
		:icon="BookCheckIcon"
		:data="chapitres"
		:modal="ChapitreForm"
		:columns="tableColumns"
		:dropdown="dropdown"
		:no-data="noData"
		:dropdown-min-width="150"
		@fetch="fetchChapitres()"
	>
		<template #status="{ data: chapitre }">
			<DoneIcon v-if="chapitre.is_done" @click="updateChapitre(chapitre.id, { is_done: false })" />
			<div
				v-else
				class="rounded-full"
				style="border: 1px solid #404041; width: 17px; height: 17px"
				@click="updateChapitre(chapitre.id, { is_done: true })"
			></div>
		</template>

		<template #name="{ data: chapitre }">
			<span class="overflow-ellipsis overflow-hidden">{{ chapitre.name }}</span>
		</template>

		<template #module="{ data: chapitre }">
			<ModuleDropdown
				small
				:value="chapitre.module_id"
				@change="(id) => updateChapitre(chapitre.id, { module_id: id })"
			></ModuleDropdown>
		</template>

		<template #time="{ data: chapitre }">
			{{ getTotalTimeForChapitre(chapitre) }}
		</template>
	</TablePageView>
</template>
