import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAxios } from '@/store/axios';
import { getCurrentOrganizationId } from '@/utils/useUser';

export const useModulesStore = defineStore('modules', () => {
	const modules = ref([]);

	async function fetchModules() {
		const team = getCurrentOrganizationId();
		if (!team) return;
		const response = await useAxios.post('modules/all', { team }, undefined, undefined, 'Failed to fetch modules');
		if (Array.isArray(response)) {
			modules.value = response;
		}
	}

	async function createModule(object, onSuccess, refresh = true) {
		const team = getCurrentOrganizationId();
		if (!team) return;
		await useAxios.post(
			'modules/create',
			{ ...object, team },
			() => (onSuccess?.(), refresh && fetchModules()),
			'Module créé avec succès',
			'Échec de la création du module'
		);
	}

	async function updateModule(moduleId, object, onSuccess, refresh = true) {
		await useAxios.post(
			'modules/update',
			{ id: moduleId, ...object },
			() => (onSuccess?.(), refresh && fetchModules()),
			'Module mis à jour avec succès',
			'Échec de la mise à jour du module'
		);
	}

	async function deleteModule(moduleId, onSuccess, refresh = true) {
		await useAxios.post(
			'modules/delete',
			{ id: moduleId },
			() => (onSuccess?.(), refresh && fetchModules()),
			'Module supprimé avec succès',
			'Échec de la suppression du module'
		);
	}

	return {
		modules: computed(() => modules.value || []),
		fetchModules,
		createModule,
		updateModule,
		deleteModule,
	};
});
