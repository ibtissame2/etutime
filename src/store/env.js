import dayjs from 'dayjs';
import { ref, computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { fetch, getCredentials } from '@/store/axios';
import { useMinuteursStore } from '@/store/minuteurs';

export const useEnvStore = defineStore('env', () => {
	const { clock } = storeToRefs(useMinuteursStore());
	const participants = ref([]);

	// is_active
	// name
	// study_time //  ? formatTime(study_time) : '00:00:00'
	const formattedStudyTime = computed(() => {
		return '55:23:45';
		// if (!currentMinuteur.value.id || !clock.value) return '00:00:00';
		// const startTime = dayjs(currentMinuteur.value.start);
		// return formatTime((clock.value || dayjs()).diff(startTime, 'second'));
	});

	function formatTime(seconds) {
		const hours = Math.floor(seconds / 3600).toString().padStart(2, '0'); // prettier-ignore
		const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0'); // prettier-ignore
		const secs = Math.floor(seconds % 60).toString().padStart(2, '0'); // prettier-ignore
		return `${hours}:${minutes}:${secs}`;
	}

	function adapter(user) {
		let duration = 0;
		let durationToday = 0;
		user.minuteurs.forEach(([start, end]) => {
			const startTime = dayjs(start);
			duration += (end ? dayjs(end) : clock.value).diff(startTime, 'seconds');
			if (startTime.format('YYYY-MM-DD') === clock.value.format('YYYY-MM-DD')) {
				durationToday += (end ? dayjs(end) : clock.value).diff(startTime, 'seconds');
			}
		});
		delete user.minuteurs;
		return {
			...user,
			duration_today_seconds: durationToday,
			duration_week: duration ? formatTime(duration) : '00:00:00',
			duration_today: durationToday ? formatTime(durationToday) : '00:00:00',
		};
	}

	const loadStudyData = async () => {
		const credentials = getCredentials();
		if (!credentials) return;
		const startDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss');
		const response = await fetch('env/getStudyParticipants', { credentials, startDate });
		if (response?.success) {
			clock.value = dayjs();
			const currentUser = response.participants.find((p) => p.current_user);
			response.participants = [currentUser, ...response.participants.filter((p) => !p.current_user)];
			participants.value = response.participants.map(adapter);
		}
	};

	return {
		participants,
		formattedStudyTime,
		loadStudyData,
	};
});
