// import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

export const useMutation = ({ mutationFn, onSuccess }) => {
	return {
		mutateAsync: (data) => {},
		isPending: { value: false },
	};
};

export const useQuery = ({ queryFn, queryKey, enabled }) => {
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
				status: 'done',
				task_id: '1',
				project_id: '1',
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
	else console.log('Missing case', queryKey);
	return {
		isLoading: { value: false },
		data: { value: data },
		refetch() {},
	};
};

export const useQueryClient = () => {
	return {
		invalidateQueries({ queryKey }) {},
	};
};
