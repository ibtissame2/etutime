import { createRouter, createWebHashHistory } from 'vue-router';

import DashboardView from '../Pages/DashboardView.vue';

const routes = [
	{
		path: '/dashboard',
		name: 'home',
		component: DashboardView,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
