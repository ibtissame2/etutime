import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
import { useTachesStore } from '@/store/taches';
import { useMinuteursStore } from '@/store/minuteurs';
import { useMembersStore } from '@/utils/useMembers';

export function initializeStores() {
	refreshStores();
}

export function refreshStores() {
	useModulesStore().fetchModules();
	useChapitresStore().fetchChapitres();
	useTachesStore().fetchTaches();
	useMinuteursStore().fetchMinuteurs();
	useMembersStore().fetchMembers();
}
