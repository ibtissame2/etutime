import axios from 'axios';
import { useNotificationsStore } from '@/utils/notification';

export const getCredentials = () => {
	let user = sessionStorage.getItem('user') || localStorage.getItem('user');
	let token = sessionStorage.getItem('token') || localStorage.getItem('token');
	if (user && token) {
		try {
			user = JSON.parse(user);
			return { user, token };
		} catch {}
	}
};

export const fetch = async (endpoint, variables, onSuccess = () => {}, successMessage, onError) => {
	try {
		const response = await axios.post(`http://localhost/etutime/front-end/src/API/${endpoint}.php`, variables);
		const success = onSuccess(response.data);
		const message = successMessage || success?.successMessage;
		if (message) useNotificationsStore().addNotification('success', message);
		return response.data;
	} catch (error) {
		let _message = error?.response?.data?.message || error?.message || error || '';
		console.error(_message);
		const message = typeof onError === 'string' ? onError : onError ? onError(_message) : error?.message;
		useNotificationsStore().addNotification('error', message);
		return error?.response?.data;
	}
};

export const fetchPython = async (endpoint, variables, onSuccess = () => {}, successMessage, onError) => {
	try {
		const response = await axios.post(`http://localhost:5000/api/${endpoint}`, variables);
		const success = onSuccess(response.data);
		const message = successMessage || success?.successMessage;
		if (message) useNotificationsStore().addNotification('success', message);
		return response.data;
	} catch (error) {
		let _message = error?.response?.data?.message || error?.message || error || '';
		console.error(_message);
		const message = typeof onError === 'string' ? onError : onError ? onError(_message) : error?.message;
		useNotificationsStore().addNotification('error', message);
		throw error; // On propage l'erreur pour la gestion dans le composant
	}
};
