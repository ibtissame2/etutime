import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ref } from 'vue';
import { createCRUDStore } from '@/store/store-template';
import { useChapitresStore } from '@/store/chapitres';
import { useTimeEntriesStore } from '@/utils/useTimeEntries';

dayjs.extend(utc);

export const useCurrentTimerStore = createCRUDStore({
	typo: {
		name: 'timers',
		methods: 'Temps',
		method: 'Temps',
		elements: 'temps',
		Element: 'temps',
		element: 'temps',
	},
	setup({ createTemps, updateTemps }) {
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

		async function setActiveState(create, object) {
			if (create) {
				startClock();
				object.start = object.start || dayjs().utc().format();
				object.end = null;
				await createTemps(object, () => (currentTimer.value = { ...object }));
			} else {
				stopClock();
				console.log('Ibtissame: update', object.id, { end: dayjs().utc().format() });
				// await updateTemps(object.id, { end: dayjs().utc().format() }, () => (currentTimer.value = null));
			}
			useTimeEntriesStore().fetchTimeEntries();
			useChapitresStore().fetchChapitres();
		}

		async function fetchCurrentTimeEntry() {
			// const organizationId = getCurrentOrganizationId();
			// if (organizationId) {
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
			// } else {
			// 	throw new Error('Failed to fetch current time entry because organization ID is missing.');
			// }
		}

		async function updateTimer() {
			// const user = getCurrentUserId();
			// const organization = getCurrentOrganizationId();
			// if (organization) {
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
			// } else {
			// 	throw new Error('Failed to fetch current time entry because organization ID is missing.');
			// }
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
