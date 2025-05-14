import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
import { useTachesStore } from '@/store/taches';
import { useTimersStore } from '@/store/timers';
import { useCurrentTimerStore } from '@/store/current-timer';
import { useMembersStore } from '@/utils/useMembers';
import { useTimeEntriesStore } from '@/utils/useTimeEntries';

export function initializeStores() {
	refreshStores();
}

export function refreshStores() {
	useModulesStore().fetchModules();
	useChapitresStore().fetchChapitres();
	useTachesStore().fetchTaches();
	useTimersStore().fetchTemps();
	useCurrentTimerStore().fetchCurrentTimeEntry();
	useTimeEntriesStore().patchTimeEntries();
	useMembersStore().fetchMembers();
}
