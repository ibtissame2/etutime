import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { fetch, getCredentials } from '@/store/axios';

export const createCRUDStore = ({ typo, setup, adapter, onFinishFetch }) => {
	return defineStore(typo.name, () => {
		const list = ref([]);
		const isLoading = ref(false);

		async function fetchData() {
			isLoading.value = true;
			const credentials = getCredentials();
			if (!credentials) return [];
			const response = await fetch(
				typo.name + '/all',
				{ credentials },
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
			const credentials = getCredentials();
			if (!credentials) return { id: -1, fetching: refresh ? new Promise() : undefined };
			const id = await fetch(
				typo.name + '/create',
				{ ...object, credentials },
				(data) => onSuccess?.(data),
				typo.Element + ' créé avec succès',
				'Échec de la création du ' + typo.element
			);
			const fetching = refresh ? fetchData() : undefined;
			return { id, fetching };
		}

		async function updateElement(id, object, onSuccess, refresh = true) {
			const credentials = getCredentials();
			if (!credentials) return;
			const response = await fetch(
				typo.name + '/update',
				{ id, credentials, ...object },
				(data) => (onSuccess?.(data), refresh && fetchData()),
				typo.Element + ' mis à jour avec succès',
				'Échec de la mise à jour du ' + typo.element
			);
			return response;
		}

		async function deleteElement(id, onSuccess, refresh = true) {
			const credentials = getCredentials();
			if (!credentials) return;
			const response = await fetch(
				typo.name + '/delete',
				{ id, credentials },
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

		const currentStore = { typo, fetch, getCredentials, ...crudProps };
		if (setup) Object.assign(currentStore, setup.call(currentStore, crudProps) || {});
		return currentStore;
	});
};
