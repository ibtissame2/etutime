import { createCRUDStore } from '@/store/store-template';

export const useChapitresStore = createCRUDStore({
	typo: {
		name: 'chapitres',
		methods: 'Chapitres',
		method: 'Chapitre',
		elements: 'chapitres',
		Element: 'Chapitre',
		element: 'chapitre',
	},
});
