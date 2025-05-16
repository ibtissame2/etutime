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
	adapter(minuteur, argument) {
		minuteur.chapitre_name = minuteur.chapitre_name || '';
		if (typeof minuteur.taches === 'string') minuteur.taches = JSON.parse(minuteur.taches);
		minuteur.duration = !minuteur.end ? 0 : dayjs(minuteur.end).diff(dayjs(minuteur.start), 'seconds');
		if (minuteur.duration < 0) (minuteur.duration = 0), (minuteur.end = null);
		if (minuteur.end === null) {
			if (!argument.alreadyExist) {
				argument.alreadyExist = true;
				this.clock.value = dayjs();
				this.nowInterval.value = setInterval(() => (this.clock.value = dayjs()), 1000);
				this.currentMinuteur.value = { ...minuteur };
			} else {
				minuteur.end = dayjs().format('YYYY-MM-DD HH:mm:ss');
				argument.shouldStop ||= [];
				argument.shouldStop.push(minuteur.id);
			}
		}
		return minuteur;
	},
	onFinishFetch(argument) {
		(argument.shouldStop || []).map((id) => this.updateMinuteur(id, { end: dayjs().format() }));
	},
	setup({ fetchMinuteurs, createMinuteur, updateMinuteur, deleteMinuteur }) {
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

		const deleteMinuteurs = async (items, onSuccess, refresh = true) => {
			if (!items.length) return;
			const onSuccessWrapper = (data) => {
				if (currentMinuteur.value.id && items.some((it) => it.id === currentMinuteur.value.id))
					currentMinuteur.value = { ...emptyMinuteur };
				onSuccess?.(data);
			};
			if (items.length > 1) {
				const { user, team } = this.getSessionInfo();
				if (!team || !user) return;
				return await this.useAxios.post(
					this.typo.name + '/delete-many',
					{ team, user, ids: items.map((it) => it.id) },
					(data) => (onSuccessWrapper(data), refresh && fetchMinuteurs()),
					'Minuteurs supprimé avec succès',
					'Échec de la suppression des minuteurs'
				);
			} else {
				return deleteMinuteur(items[0].id, onSuccessWrapper, refresh);
			}
		};

		return {
			currentMinuteur,
			clock,
			nowInterval,
			toggleStartStopMinuteur,
			updateMinuteurs,
			deleteMinuteurs,
		};
	},
});
