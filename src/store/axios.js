import axios from 'axios';
import { useNotificationsStore } from '@/utils/notification';

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
