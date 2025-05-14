import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAxios } from '@/store/axios';
import { getCurrentOrganizationId, getCurrentUserId } from '@/utils/useUser';

export const createCRUDStore = ({ typo, setup, adapter }) => {
	return defineStore(typo.name, () => {
		const list = ref([]);
		const isLoading = ref(false);

		async function fetchData() {
			isLoading.value = true;
			const team = getCurrentOrganizationId();
			const user = getCurrentUserId();
			if (!team || !user) return;
			const response = await useAxios.post(
				typo.name + '/all',
				{ team, user },
				undefined,
				undefined,
				'Échec de la récupération des ' + typo.elements
			);
			if (Array.isArray(response)) {
				list.value = response.map((element) => (adapter ? adapter(element) : element));
			}
			isLoading.value = false;
			return list.value;
		}

		async function createElement(object, onSuccess, refresh = true) {
			const team = getCurrentOrganizationId();
			const user = getCurrentUserId();
			if (!team || !user) return;
			const id = await useAxios.post(
				typo.name + '/create',
				{ team, user, ...object },
				() => onSuccess?.(),
				typo.Element + ' créé avec succès',
				'Échec de la création du ' + typo.element
			);
			const fetching = refresh ? fetchData() : undefined;
			return { id, fetching };
		}

		async function updateElement(id, object, onSuccess, refresh = true) {
			const team = getCurrentOrganizationId();
			const user = getCurrentUserId();
			if (!team || !user) return;
			const response = await useAxios.post(
				typo.name + '/update',
				{ id, team, user, ...object },
				() => (onSuccess?.(), refresh && fetchData()),
				typo.Element + ' mis à jour avec succès',
				'Échec de la mise à jour du ' + typo.element
			);
			return response;
		}

		async function deleteElement(id, onSuccess, refresh = true) {
			const team = getCurrentOrganizationId();
			const user = getCurrentUserId();
			if (!team || !user) return;
			const response = await useAxios.post(
				typo.name + '/delete',
				{ id, team, user },
				() => (onSuccess?.(), refresh && fetchData()),
				typo.Element + ' supprimé avec succès',
				'Échec de la suppression du ' + typo.element
			);
			return response;
		}

		const crudProps = {
			isLoading,
			[typo.name]: computed(() => list.value),
			['fetch' + typo.methods]: fetchData,
			['create' + typo.method]: createElement,
			['update' + typo.method]: updateElement,
			['delete' + typo.method]: deleteElement,
		};
		return {
			...crudProps,
			...(setup?.(crudProps) || {}),
		};
	});
};
