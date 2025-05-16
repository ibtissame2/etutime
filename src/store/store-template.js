import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAxios } from '@/store/axios';
import { getCurrentOrganizationId, getCurrentUserId } from '@/utils/useUser';

export const createCRUDStore = ({ typo, setup, adapter, onFinishFetch }) => {
	return defineStore(typo.name, () => {
		const list = ref([]);
		const isLoading = ref(false);

		function getSessionInfo() {
			return { user: getCurrentUserId(), team: getCurrentOrganizationId() };
		}

		async function fetchData() {
			isLoading.value = true;
			const { user, team } = getSessionInfo();
			if (!team || !user) return;
			const response = await useAxios.post(
				typo.name + '/all',
				{ team, user },
				undefined,
				undefined,
				'Échec de la récupération des ' + typo.elements
			);
			if (Array.isArray(response)) {
				let argument = {};
				list.value = response.map((element) => (adapter ? adapter.call(currentStore, element, argument) : element));
				onFinishFetch?.call(currentStore, argument);
			}
			isLoading.value = false;
			return list.value;
		}

		async function createElement(object, onSuccess, refresh = true) {
			const { user, team } = getSessionInfo();
			if (!team || !user) return;
			const id = await useAxios.post(
				typo.name + '/create',
				{ team, user, ...object },
				(data) => onSuccess?.(data),
				typo.Element + ' créé avec succès',
				'Échec de la création du ' + typo.element
			);
			const fetching = refresh ? fetchData() : undefined;
			return { id, fetching };
		}

		async function updateElement(id, object, onSuccess, refresh = true) {
			const { user, team } = getSessionInfo();
			if (!team || !user) return;
			const response = await useAxios.post(
				typo.name + '/update',
				{ id, team, user, ...object },
				(data) => (onSuccess?.(data), refresh && fetchData()),
				typo.Element + ' mis à jour avec succès',
				'Échec de la mise à jour du ' + typo.element
			);
			return response;
		}

		async function deleteElement(id, onSuccess, refresh = true) {
			const { user, team } = getSessionInfo();
			if (!team || !user) return;
			const response = await useAxios.post(
				typo.name + '/delete',
				{ id, team, user },
				(data) => (onSuccess?.(data), refresh && fetchData()),
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

		const currentStore = { typo, useAxios, getSessionInfo, ...crudProps };
		if (setup) Object.assign(currentStore, setup.call(currentStore, crudProps) || {});
		return currentStore;
	});
};
