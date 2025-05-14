import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ref } from 'vue';
import { createCRUDStore } from '@/store/store-template';
import { useChapitresStore } from '@/store/chapitres';
import { useTimeEntriesStore } from '@/utils/useTimeEntries';

export const useMinuteursStore = createCRUDStore({
	typo: {
		name: 'timers',
		methods: 'Minuteurs',
		method: 'Minuteur',
		elements: 'minuteurs',
		Element: 'Minuteur',
		element: 'minuteur',
	},
	adapter: (timer) => {
		if (typeof timer.taches === 'string') timer.taches = JSON.parse(timer.taches);
		return timer;
	},
	setup({ createMinuteur, updateMinuteur }) {
		const currentTimer = ref(null);
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

		async function setActiveState(create, object, acceptStart) {
			if (create) {
				startClock();
				object.start = acceptStart ? object.start || dayjs().utc().format() : dayjs().utc().format();
				object.end = null;
				await createMinuteur(object, (id) => (currentTimer.value = { ...object, id }));
			} else {
				stopClock();
				console.log('Ibtissame: update', object.id, { end: dayjs().utc().format() });
				// await updateMinuteur(object.id, { end: dayjs().utc().format() }, () => (currentTimer.value = null));
			}
			useTimeEntriesStore().fetchTimeEntries();
			useChapitresStore().fetchChapitres();
		}

		async function fetchCurrentTimeEntry() {
			// const organizationId = getCurrentOrganizationId();
			// 	try {
			// 		// Ibtissame
			// 		const timeEntriesResponse = await api.getMyActiveTimeEntry({});
			// 		if (timeEntriesResponse?.data) {
			// 			if (timeEntriesResponse.data) {
			// 				currentTimer.value = timeEntriesResponse.data;
			// 				if (currentTimer.value.start !== '' && currentTimer.value.end === null) {
			// 					startClock();
			// 				}
			// 			} else {
			// 				currentTimer.value = null;
			// 			}
			// 		}
			// 	} catch {
			// 		currentTimer.value = null;
			// 	}
		}

		async function updateTimer() {
			// const user = getCurrentUserId();
			// const organization = getCurrentOrganizationId();
			// 	const response = await handleApiRequestNotifications(
			// 		() =>
			// 			api.updateTimeEntry(
			// 				{
			// 					description: currentTimer.value.description,
			// 					user_id: user,
			// 					module_id: currentTimer.value.module_id,
			// 					chapitre_id: currentTimer.value.chapitre_id,
			// 					start: currentTimer.value.start,
			// 					end: null,
			// 					taches: currentTimer.value.taches,
			// 				},
			// 				{
			// 					params: {
			// 						organization: organization,
			// 						timeEntry: currentTimer.value.id,
			// 					},
			// 				}
			// 			),
			// 		'Time entry updated!'
			// 	);
			// 	if (response?.data) {
			// 		currentTimer.value = response.data;
			// 	}
		}

		return {
			currentTimer,
			clock,
			fetchCurrentTimeEntry,
			startClock,
			stopClock,
			setActiveState,
		};
	},
});
