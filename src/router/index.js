import { createRouter, createWebHashHistory } from 'vue-router';

import DashboardView from '../Pages/DashboardView.vue';
import EmploiView from '../Pages/EmploiView.vue';
import EnvView from '../Pages/EnvView.vue';
import TimeView from '../Pages/TimeView.vue';
import ReportingView from '../Pages/ReportingView.vue';
import ModulesView from '../Pages/ModulesView.vue';
import EtudiantsView from '../Pages/EtudiantsView.vue';
import TagsView from '../Pages/TagsView.vue';
import NotesView from '../Pages/NotesView.vue';
import ImportView from '../Pages/ImportView.vue';

const routes = [
	{
		path: '/dashboard',
		name: 'Accueil',
		component: DashboardView,
	},
	{
		path: '/emploi',
		name: 'Emploi du temps',
		component: EmploiView,
	},
	{
		path: '/env',
		name: 'Envirenement du travail',
		component: EnvView,
	},
	{
		path: '/time',
		name: 'Temps',
		component: TimeView,
	},
	{
		path: '/rapport',
		name: 'Rapport',
		component: ReportingView,
	},
	{
		path: '/modules',
		name: 'Modules',
		component: ModulesView,
	},
	{
		path: '/etudiants',
		name: 'Etudiants',
		component: EtudiantsView,
	},
	{
		path: '/taches',
		name: 'Tâches',
		component: TagsView,
	},
	{
		path: '/notes',
		name: 'Notes',
		component: NotesView,
	},
	{
		path: '/import',
		name: 'Import',
		component: ImportView,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
