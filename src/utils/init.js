import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
import { useTachesStore } from '@/store/taches';
import { useCurrentTimeEntryStore } from '@/utils/useCurrentTimeEntry';
import { useMembersStore } from '@/utils/useMembers';
import { useTimeEntriesStore } from '@/utils/useTimeEntries';

export function initializeStores() {
	refreshStores();
}

export function refreshStores() {
	useModulesStore().fetchModules();
	useChapitresStore().fetchChapitres();
	useTachesStore().fetchTaches();
	useCurrentTimeEntryStore().fetchCurrentTimeEntry();
	useTimeEntriesStore().patchTimeEntries();
	useMembersStore().fetchMembers();
}
