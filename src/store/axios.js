import axios from 'axios';
import { useNotificationsStore } from '@/utils/notification';
let addNotification;

const protectedObject = {
	post: async (endpoint, variables, onSuccess = () => {}, successMessage, onError) => {
		try {
			const response = await axios.post(`http://localhost/etutime/front-end/src/API/${endpoint}.php`, variables);
			const success = onSuccess(response);
			const message = successMessage || success?.successMessage;
			if (message) addNotification('success', message);
			return response.data;
		} catch (error) {
			console.error(error?.message || error);
			const message = typeof onError === 'string' ? onError : onError(error, error.message || '');
			addNotification('error', message);
		}
	},
};

export const useAxios = new Proxy(protectedObject, {
	get: (_, prop) => {
		addNotification = addNotification || useNotificationsStore().addNotification;
		return protectedObject[prop];
	},
});
