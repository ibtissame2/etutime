import axios from 'axios';
import { useNotificationsStore } from '@/utils/notification';

export const getCredentials = () => {
	let token = sessionStorage.getItem('token') || localStorage.getItem('token');
	if (token) return { token };
};

export const fetch = async (endpoint, variables = {}, onSuccess = () => {}, successMessage, onError) => {
	try {
		const credentials = getCredentials();
		const headers = {};
		if (credentials && credentials.token) {
			headers.Authorization = `Bearer ${credentials.token}`;
		}
		endpoint = `http://localhost/etutime/front-end/src/API/${endpoint}.php`;
		const response = await axios.post(endpoint, variables, { headers });
		const success = onSuccess(response.data);
		const message = successMessage || success?.successMessage;
		if (message) useNotificationsStore().addNotification('success', message);
		return response.data;
	} catch (error) {
		let _message = error?.response?.data?.message || error?.message || error || '';
		console.error(_message);
		const message = typeof onError === 'string' ? onError : onError ? onError(_message) : error?.message;
		if (message) useNotificationsStore().addNotification('error', message);
		return error?.response?.data;
	}
};

export const fetchPython = async (endpoint, variables = {}, onSuccess = () => {}, successMessage, onError) => {
	try {
		const credentials = getCredentials();
		const headers = {};
		if (credentials && credentials.token) {
			headers.Authorization = `Bearer ${credentials.token}`;
		}

		const response = await axios.post(`http://localhost:5000/api/${endpoint}`, variables, { headers });
		const success = onSuccess(response.data);
		const message = successMessage || success?.successMessage;
		if (message) useNotificationsStore().addNotification('success', message);
		return response.data;
	} catch (error) {
		let _message = error?.response?.data?.message || error?.message || error || '';
		console.error(_message);
		const message = typeof onError === 'string' ? onError : onError ? onError(_message) : error?.message;
		if (message) useNotificationsStore().addNotification('error', message);
		throw error;
	}
};
