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

		async function toggleStartStopMinuteur(create, object, acceptStart, acceptEnd) {
			const onSuccessStop = (o) => Object.assign(currentMinuteur.value, { ...o, start: '', end: null, id: null });
			if (create) {
				if (nowInterval.value !== null) clearInterval(nowInterval.value);
				clock.value = dayjs().utc();
				nowInterval.value = setInterval(() => (clock.value = dayjs().utc()), 1000);
				object.start = acceptStart ? object.start || dayjs().utc().format() : dayjs().utc().format();
				if (!acceptEnd) object.end = null;
				await createMinuteur(object, (id) => {
					if (object.end) onSuccessStop(object);
					else currentMinuteur.value = { ...object, id };
				});
			} else {
				if (nowInterval.value !== null) clearInterval(nowInterval.value);
				await updateMinuteur(object.id, { end: dayjs().utc().format() }, () => onSuccessStop({}));
			}
			useTimeEntriesStore().fetchTimeEntries();
			useChapitresStore().fetchChapitres();
		}

		return {
			currentMinuteur,
			clock,
			toggleStartStopMinuteur,
		};
	},
});
