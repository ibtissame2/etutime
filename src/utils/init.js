import { useModulesStore } from '@/store/modules';
import { useTasksStore } from '@/utils/useTasks';
import { useTagsStore } from '@/utils/useTags';
import { useCurrentTimeEntryStore } from '@/utils/useCurrentTimeEntry';
import { useClientsStore } from '@/utils/useClients';
import { useMembersStore } from '@/utils/useMembers';
import { useTimeEntriesStore } from '@/utils/useTimeEntries';
import { canViewClients, canViewMembers } from '@/utils/permissions';

export function initializeStores() {
	refreshStores();
}

export function refreshStores() {
	useModulesStore().fetchModules();
	useTasksStore().fetchTasks();
	useTagsStore().fetchTags();
	useCurrentTimeEntryStore().fetchCurrentTimeEntry();
	useTimeEntriesStore().patchTimeEntries();
	if (canViewMembers()) {
		useMembersStore().fetchMembers();
	}
	if (canViewClients()) {
		useClientsStore().fetchClients();
	}
}
