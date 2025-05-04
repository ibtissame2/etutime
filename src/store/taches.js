import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAxios } from '@/store/axios';
import { getCurrentOrganizationId } from '@/utils/useUser';

export const useTachesStore = defineStore('taches', () => {
	const taches = ref([]);

	async function fetchTaches() {
		const team = getCurrentOrganizationId();
		if (!team) return;
		const response = await useAxios.post('taches/all', { team }, undefined, undefined, 'Failed to fetch taches');
		if (Array.isArray(response)) {
			taches.value = response;
		}
	}

	async function createTache(object, onSuccess, refresh = true) {
		const team = getCurrentOrganizationId();
		if (!team) return;
		await useAxios.post(
			'taches/create',
			{ ...object, team },
			() => (onSuccess?.(), refresh && fetchTaches()),
			'Tâche créé avec succès',
			'Échec de la création du tâche'
		);
	}

	async function deleteTache(tacheId, onSuccess, refresh = true) {
		await useAxios.post(
			'taches/delete',
			{ id: tacheId },
			() => (onSuccess?.(), refresh && fetchTaches()),
			'Tâche supprimé avec succès',
			'Échec de la suppression du tâche'
		);
	}

	return {
		taches: computed(() => taches.value || []),
		fetchTaches,
		createTache,
		deleteTache,
	};
});
