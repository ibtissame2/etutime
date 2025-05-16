import { ref, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { getCurrentOrganizationId } from '@/utils/useUser';
import { useNotificationsStore } from '@/utils/notification';
import { useModulesStore } from '@/store/modules';
import { useMembersStore } from '@/utils/useMembers';
import { useChapitresStore } from '@/store/chapitres';
import { CheckCircleIcon, UserGroupIcon } from '@heroicons/vue/20/solid';
import { DocumentTextIcon, FolderIcon } from '@heroicons/vue/16/solid';
const api = new Proxy({}, { get: () => () => ({}) });

export const useReportingStore = defineStore('reporting', () => {
	const reportingGraphResponse = ref(null);
	const reportingTableResponse = ref(null);

	const { handleApiRequestNotifications } = useNotificationsStore();

	async function fetchGraphReporting(params) {
		const organization = getCurrentOrganizationId();
		if (organization) {
			reportingGraphResponse.value = await handleApiRequestNotifications(
				() =>
					api.getAggregatedTimeEntries({
						params: {
							organization: organization,
						},
						queries: params,
					}),
				undefined,
				'Failed to fetch reporting data'
			);
		}
	}

	async function fetchTableReporting(params) {
		const organization = getCurrentOrganizationId();
		if (organization) {
			reportingTableResponse.value = await handleApiRequestNotifications(
				() =>
					api.getAggregatedTimeEntries({
						params: {
							organization: organization,
						},
						queries: params,
					}),
				undefined,
				'Failed to fetch reporting data'
			);
		}
	}

	const aggregatedGraphTimeEntries = computed(() => {
		return reportingGraphResponse.value?.data;
	});

	const aggregatedTableTimeEntries = computed(() => {
		return reportingTableResponse.value?.data;
	});

	const emptyPlaceholder = {
		user: 'No User',
		project: 'No Project',
		task: 'No Task',
		description: 'No Description',
	};

	function getNameForReportingRowEntry(key, type) {
		if (type === null) return null;
		if (key === null) return emptyPlaceholder[type];
		if (type === 'project') {
			const { modules } = storeToRefs(useModulesStore());
			return modules.value.find((module) => module.id === key)?.name;
		} else if (type === 'task') {
			const { chapitres } = storeToRefs(useChapitresStore());
			return chapitres.value.find((chapitre) => chapitre.id === key)?.name;
		} else if (type === 'user') {
			const { members } = storeToRefs(useMembersStore());
			return members.value.find((member) => member.user_id === key)?.name;
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
		fetchGraphReporting,
		fetchTableReporting,
		aggregatedTableTimeEntries,
		getNameForReportingRowEntry,
		groupByOptions,
		emptyPlaceholder,
	};
});
