import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAxios } from '@/store/axios';
import { getCurrentOrganizationId } from '@/utils/useUser';

export const createCRUDStore = (typo) => {
	return defineStore(typo.name, () => {
		const list = ref([]);

		async function fetchData() {
			const team = getCurrentOrganizationId();
			if (!team) return;
			const response = await useAxios.post(
				typo.name + '/all',
				{ team },
				undefined,
				undefined,
				'Échec de la récupération des ' + typo.elements
			);
			if (Array.isArray(response)) {
				list.value = response;
			}
			return list.value;
		}

		async function createElement(object, onSuccess, refresh = true) {
			const team = getCurrentOrganizationId();
			if (!team) return;
			const id = await useAxios.post(
				typo.name + '/create',
				{ ...object, team },
				() => (onSuccess?.(), refresh && fetchData()),
				typo.Element + ' créé avec succès',
				'Échec de la création du ' + typo.element
			);
			return id;
		}

		async function updateElement(id, object, onSuccess, refresh = true) {
			const response = await useAxios.post(
				typo.name + '/update',
				{ id, ...object },
				() => (onSuccess?.(), refresh && fetchData()),
				typo.Element + ' mis à jour avec succès',
				'Échec de la mise à jour du ' + typo.element
			);
			return response;
		}

		async function deleteElement(id, onSuccess, refresh = true) {
			const response = await useAxios.post(
				typo.name + '/delete',
				{ id },
				() => (onSuccess?.(), refresh && fetchData()),
				typo.Element + ' supprimé avec succès',
				'Échec de la suppression du ' + typo.element
			);
			return response;
		}

		return {
			[typo.name]: computed(() => list.value || []),
			['fetch' + typo.methods]: fetchData,
			['create' + typo.method]: createElement,
			['update' + typo.method]: updateElement,
			['delete' + typo.method]: deleteElement,
		};
	});
};
