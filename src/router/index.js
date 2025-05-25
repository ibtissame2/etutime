import { createRouter, createWebHashHistory } from "vue-router";

import DashboardView from "@/Pages/DashboardView.vue";
import EmploiView from "@/Pages/EmploiView.vue";
import EnvView from "@/Pages/EnvView.vue";
import TimeView from "@/Pages/TimeView.vue";
import ReportingView from "@/Pages/ReportingView.vue";
import ModulesView from "@/Pages/ModulesView.vue";
import ChapitresView from "@/Pages/ChapitresView.vue";
import TagsView from "@/Pages/TagsView.vue";
import NotesView from "@/Pages/NotesView.vue";
import ImportView from "@/Pages/ImportView.vue";
import ProfileView from "@/Pages/ProfileView.vue";
import SeConnecter from "@/Pages/SeConnecter.vue";
import AppView from "@/Pages/AppView.vue";

const routes = [
  {
    path: "/",
    name: "connection",
    component: SeConnecter,
  },
  {
    path: "/app",
    name: "questionnaire",
    component: AppView,
  },
  {
    path: "/dashboard",
    name: "Accueil",
    component: DashboardView,
  },
  {
    path: "/emploi",
    name: "Emploi du temps",
    component: EmploiView,
  },
  {
    path: "/env",
    name: "Envirenement du travail",
    component: EnvView,
  },
  {
    path: "/time",
    name: "Temps",
    component: TimeView,
  },
  {
    path: "/rapport",
    name: "Rapport",
    component: ReportingView,
  },
  {
    path: "/modules",
    name: "Modules",
    component: ModulesView,
  },
  {
    path: "/chapitres",
    name: "Chapitres",
    component: ChapitresView,
  },
  {
    path: "/taches",
    name: "Tâches",
    component: TagsView,
  },
  {
    path: "/notes",
    name: "Notes",
    component: NotesView,
  },
  {
    path: "/import",
    name: "Import",
    component: ImportView,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
