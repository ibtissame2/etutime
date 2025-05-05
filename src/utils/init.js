import { useModulesStore } from '@/store/modules';
import { useTachesStore } from '@/store/taches';
import { useTasksStore } from '@/utils/useTasks';
import { useCurrentTimeEntryStore } from '@/utils/useCurrentTimeEntry';
import { useMembersStore } from '@/utils/useMembers';
import { useTimeEntriesStore } from '@/utils/useTimeEntries';

export function initializeStores() {
	refreshStores();
}

export function refreshStores() {
	useModulesStore().fetchModules();
	useTachesStore().fetchTaches();
	useTasksStore().fetchTasks();
	useCurrentTimeEntryStore().fetchCurrentTimeEntry();
	useTimeEntriesStore().patchTimeEntries();
	useMembersStore().fetchMembers();
}
