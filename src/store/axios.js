import axios from 'axios';
import { useNotificationsStore } from '@/store/notification';

export const getCredentials = () => {
	let token = sessionStorage.getItem('token') || localStorage.getItem('token');
	if (token) return { token };
};

export const fetch = async (endpoint, variables = {}, onSuccess = () => {}, successMessage, errorMessage) => {
	try {
		const credentials = getCredentials();
		const headers = {};
		if (credentials && credentials.token) {
			headers.Authorization = `Bearer ${credentials.token}`;
		}
		endpoint = `http://localhost/etutime/front-end/src/API/${endpoint}.php`;
		const response = await axios.post(endpoint, variables, { headers });
		onSuccess(response.data);
		if (successMessage) useNotificationsStore().addNotification('success', successMessage);
		return response.data;
	} catch (error) {
		console.error(error);
		if (errorMessage) useNotificationsStore().addNotification('error', errorMessage);
		return error?.response?.data;
	}
};

export const fetchPython = async (endpoint, variables = {}) => {
	const credentials = getCredentials();
	const headers = {};
	if (credentials && credentials.token) {
		headers.Authorization = `Bearer ${credentials.token}`;
	}
	const response = await axios.post(`http://localhost:5000/api/${endpoint}`, variables, { headers });
	return response.data;
};
