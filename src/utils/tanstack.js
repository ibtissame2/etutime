// import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';
import { ref } from 'vue';

export const useMutation = ({ mutationFn, onSuccess }) => {
	const isPending = ref(true);
	setTimeout(() => {
		isPending.value = false;
	}, 50);
	return {
		mutateAsync: (data) => {},
		isPending: isPending,
	};
};

export const useQuery = ({ queryFn, queryKey, enabled }) => {
	setTimeout(async () => {
		const response = await axios.post('http://localhost/etutime/front-end/src/API/index.php?action=users');
		const data = response.data.data;
		console.log(data);
	});

	let data;
	if (queryKey[0] === 'dailyTrackedHours' || queryKey[0] === 'lastSevenDays' || queryKey[0] === 'weeklyHistory')
		data = [
			{ date: '2025-04-20', duration: 6, history: [1, 2, 3] },
			{ date: '2025-04-20', duration: 1, history: [1] },
		];
	else if (queryKey[0] === 'timeEntries' || queryKey[0] === 'latestTeamActivity')
		data = [
			{
				time_entry_id: '1',
				name: 'time 1',
				description: 'Hello',
				status: true,
				task_id: '1',
				project_id: '1',
				tags: [],
				billable: false,
			},
			{
				time_entry_id: '2',
				name: 'time 2',
				description: 'Hello 2',
				status: false,
				task_id: '2',
				project_id: '2',
				tags: [],
				billable: false,
			},
		];
	else if (queryKey[0] === 'weeklyProjectOverview')
		data = [
			{ value: 12, name: 'A', color: '#ffa000' },
			{ value: 1, name: 'B', color: '#9fa020' },
		];
	else if (queryKey[0] === 'api-tokens') data = [];
	else if (queryKey[0] === 'totalWeeklyTime') data = 12;

	const dataRef = ref();
	const isLoading = ref(true);

	setTimeout(() => {
		dataRef.value = data;
		isLoading.value = false;
	}, 50);

	return {
		isLoading: isLoading,
		data: dataRef,
		refetch() {},
	};
};

export const useQueryClient = () => {
	return {
		invalidateQueries({ queryKey }) {},
	};
};
