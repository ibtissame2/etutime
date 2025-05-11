import { createCRUDStore } from '@/store/store-template';

export const useNotesStore = createCRUDStore({
	typo: {
		name: 'notes',
		methods: 'Notes',
		method: 'Note',
		elements: 'notes',
		Element: 'Note',
		element: 'note',
	},
});
