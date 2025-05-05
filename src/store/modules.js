import { createCRUDStore } from '@/store/store-template';

export const useModulesStore = createCRUDStore({
	name: 'modules',
	methods: 'Modules',
	method: 'Module',
	elements: 'modules',
	Element: 'Module',
	element: 'module',
});
