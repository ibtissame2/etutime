import { createCRUDStore } from '@/store/store-template';

export const useModulesStore = createCRUDStore({
	typo: {
		name: 'modules',
		methods: 'Modules',
		method: 'Module',
		elements: 'modules',
		Element: 'Module',
		element: 'module',
	},
});
