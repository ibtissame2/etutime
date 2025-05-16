import dayjs from 'dayjs';
import { ref } from 'vue';
import { createCRUDStore } from '@/store/store-template';
import { useChapitresStore } from '@/store/chapitres';

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
		minuteur.duration = !minuteur.end ? 0 : dayjs(minuteur.end).diff(dayjs(minuteur.start), 'seconds');
		if (minuteur.duration < 0) (minuteur.duration = 0), (minuteur.end = null);
		return minuteur;
	},
	setup({ fetchMinuteurs, createMinuteur, updateMinuteur }) {
		const currentMinuteur = ref({ ...emptyMinuteur });
		const clock = ref(null);
		const nowInterval = ref(null);

		async function toggleStartStopMinuteur(create, object, acceptStart, acceptEnd) {
			const onSuccessStop = (o) =>
				Object.assign(currentMinuteur.value, { ...o, duration: 0, start: '', end: null, id: null });
			if (create) {
				if (nowInterval.value !== null) clearInterval(nowInterval.value);
				clock.value = dayjs();
				nowInterval.value = setInterval(() => (clock.value = dayjs()), 1000);
				object.start = dayjs(acceptStart && object.start ? object.start : dayjs().format()).format();
				if (!acceptEnd) object.end = null;
				await createMinuteur(object, (id) => {
					if (object.end) onSuccessStop(object);
					else currentMinuteur.value = { ...object, id, duration: 0 };
				});
			} else {
				if (nowInterval.value !== null) clearInterval(nowInterval.value);
				await updateMinuteur(object.id, { end: dayjs().format() }, () => onSuccessStop({}));
			}
			useChapitresStore().fetchChapitres();
		}

		async function updateMinuteurs(ids, changes) {
			// const organizationId = getCurrentOrganizationId();
			// if (organizationId) {
			// 	await handleApiRequestNotifications(
			// 		() => api.updateMultipleTimeEntries({ ids: ids, changes: changes }),
			// 		'Time entries updated successfully',
			// 		'Failed to update time entries'
			// 	);
			// 	await fetchMinuteurs();
			// }
		}

		async function deleteMinuteurs(timeEntries) {
			// const organizationId = getCurrentOrganizationId();
			// const timeEntryIds = timeEntries.map((entry) => entry.id);
			// if (organizationId) {
			// 	await handleApiRequestNotifications(
			// 		() => api.deleteTimeEntries(undefined, { queries: { ids: timeEntryIds } }),
			// 		'Time entries deleted successfully',
			// 		'Failed to delete time entries'
			// 	);
			// 	await fetchMinuteurs();
			// }
		}

		return {
			currentMinuteur,
			clock,
			toggleStartStopMinuteur,
			updateMinuteurs,
			deleteMinuteurs,
		};
	},
});
