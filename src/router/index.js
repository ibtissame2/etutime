import { createRouter, createWebHashHistory } from 'vue-router';

import DashboardView from '../Pages/DashboardView.vue';
import TimeView from '../Pages/TimeView.vue';
import ReportingView from '../Pages/ReportingView.vue';

const routes = [
	{
		path: '/dashboard',
		name: 'Accueil',
		component: DashboardView,
	},
	{
		path: '/time',
		name: 'Temps',
		component: TimeView,
	},
	{
		path: '/reporting',
		name: 'Rapport',
		component: ReportingView,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
