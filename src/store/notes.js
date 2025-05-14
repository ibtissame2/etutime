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
	adapter: (note) => {
		if (typeof note.content === 'string') note.content = JSON.parse(note.content);
		return note;
	},
});
