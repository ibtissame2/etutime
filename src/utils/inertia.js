// import { Head, Link, router, route } from '@inertiajs/vue3';

export const router = {
	reload: function (options) {},
	post: function (name) {
		route.setCurrent(name);
	},
};

const route = function (...parts) {
	return parts.join('/');
};
route.currentRoute = undefined;
route.current = function (name) {
	return route.currentRoute === name;
};
route.setCurrent = function (name) {
	return (route.currentRoute = name);
};
export { route };
