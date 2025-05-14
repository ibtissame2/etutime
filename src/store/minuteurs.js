import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ref } from 'vue';
import { createCRUDStore } from '@/store/store-template';
import { useChapitresStore } from '@/store/chapitres';
import { useTimeEntriesStore } from '@/utils/useTimeEntries';

const emptyMinuteur = {
	id: null,
	module_id: null,
	chapitre_id: null,
	chapitre_name: '',
	taches: [],
	start: '',
	end: null,
};

export const useMinuteursStore = createCRUDStore({
	typo: {
		name: 'minuteurs',
		methods: 'Minuteurs',
		method: 'Minuteur',
		elements: 'minuteurs',
		Element: 'Minuteur',
		element: 'minuteur',
	},
	adapter: (minuteur) => {
		if (typeof minuteur.taches === 'string') minuteur.taches = JSON.parse(minuteur.taches);
		return minuteur;
	},
	setup({ createMinuteur, updateMinuteur }) {
		const currentMinuteur = ref({ ...emptyMinuteur });
		const clock = ref(null);
		const nowInterval = ref(null);

		function startClock() {
			stopClock();
			clock.value = dayjs().utc();
			nowInterval.value = setInterval(() => (clock.value = dayjs().utc()), 1000);
		}

		function stopClock() {
			if (nowInterval.value !== null) clearInterval(nowInterval.value);
		}

		async function toggleStartStopMinuteur(create, object, acceptStart) {
			if (create) {
				startClock();
				object.start = acceptStart ? object.start || dayjs().utc().format() : dayjs().utc().format();
				object.end = null;
				await createMinuteur(object, (id) => (currentMinuteur.value = { ...object, id }));
			} else {
				stopClock();
				const onSuccess = () => Object.assign(currentMinuteur.value, { start: '', id: null });
				await updateMinuteur(object.id, { end: dayjs().utc().format() }, onSuccess);
			}
			useTimeEntriesStore().fetchTimeEntries();
			useChapitresStore().fetchChapitres();
		}

		return {
			currentMinuteur,
			clock,
			startClock,
			stopClock,
			toggleStartStopMinuteur,
		};
	},
});
