import { ref, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useNotificationsStore } from '@/utils/notification';
import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
import { CheckCircleIcon, UserGroupIcon } from '@heroicons/vue/20/solid';
import { DocumentTextIcon, FolderIcon } from '@heroicons/vue/16/solid';
const api = new Proxy({}, { get: () => () => ({}) });

export const useRapportStore = defineStore('rapport', () => {
	const rapportGraphResponse = ref(null);
	const rapportTableResponse = ref(null);

	const { handleApiRequestNotifications } = useNotificationsStore();

	async function fetchGraphRapport(params) {
		const organization = 1;
		if (organization) {
			rapportGraphResponse.value = await handleApiRequestNotifications(
				() =>
					api.getAggregatedTimeEntries({
						params: {
							organization: organization,
						},
						queries: params,
					}),
				undefined,
				'Failed to fetch rapport data'
			);
		}
	}

	async function fetchTableRapport(params) {
		const organization = 1;
		if (organization) {
			rapportTableResponse.value = await handleApiRequestNotifications(
				() =>
					api.getAggregatedTimeEntries({
						params: {
							organization: organization,
						},
						queries: params,
					}),
				undefined,
				'Failed to fetch rapport data'
			);
		}
	}

	const aggregatedGraphTimeEntries = computed(() => {
		return rapportGraphResponse.value?.data;
	});

	const aggregatedTableTimeEntries = computed(() => {
		return rapportTableResponse.value?.data;
	});

	const emptyPlaceholder = {
		user: 'No User',
		project: 'No Project',
		task: 'No Task',
		description: 'No Description',
	};

	function getNameForRapportRowEntry(key, type) {
		if (type === null) return null;
		if (key === null) return emptyPlaceholder[type];
		if (type === 'project') {
			const { modules } = storeToRefs(useModulesStore());
			return modules.value.find((module) => module.id === key)?.name;
		} else if (type === 'task') {
			const { chapitres } = storeToRefs(useChapitresStore());
			return chapitres.value.find((chapitre) => chapitre.id === key)?.name;
		} else if (type === 'user') {
			return 'Ibtissame';
		} else return key;
	}

	const groupByOptions = [
		{
			label: 'Etudiant',
			value: 'user',
			icon: UserGroupIcon,
		},
		{
			label: 'Modules',
			value: 'project',
			icon: FolderIcon,
		},
		{
			label: 'Tache',
			value: 'task',
			icon: CheckCircleIcon,
		},
		{
			label: 'Chapitre',
			value: 'description',
			icon: DocumentTextIcon,
		},
	];

	return {
		aggregatedGraphTimeEntries,
		fetchGraphRapport,
		fetchTableRapport,
		aggregatedTableTimeEntries,
		getNameForRapportRowEntry,
		groupByOptions,
		emptyPlaceholder,
	};
});
