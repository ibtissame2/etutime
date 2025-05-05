import { createCRUDStore } from '@/store/store-template';

export const useTachesStore = createCRUDStore({
	name: 'taches',
	methods: 'Taches',
	method: 'Tache',
	elements: 'tâches',
	Element: 'Tâche',
	element: 'tâche',
});
