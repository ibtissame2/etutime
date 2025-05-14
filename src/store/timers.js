import { createCRUDStore } from '@/store/store-template';

export const useTimersStore = createCRUDStore({
	typo: {
		name: 'timers',
		methods: 'Timers',
		method: 'Timer',
		elements: 'timers',
		Element: 'Timer',
		element: 'timer',
	},
	adapter: (timer) => {
		if (typeof timer.taches === 'string') timer.taches = JSON.parse(timer.taches);
		return timer;
	},
});
