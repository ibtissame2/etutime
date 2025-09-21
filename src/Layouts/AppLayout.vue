<script setup>
import { ref, watch, onMounted, onBeforeMount } from 'vue';
import { theme } from '@/utils/theme';
import { route } from '@/utils/inertia';
import { fetch, getCredentials } from '@/store/axios';
import { useRouter } from 'vue-router';
import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
import { useTachesStore } from '@/store/taches';
import { useMinuteursStore } from '@/store/minuteurs';
import CurrentSidebarTimer from '@/Components/CurrentSidebarTimer.vue';
import NotificationContainer from '@/Components/NotificationContainer.vue';
import NavigationSidebarLink from '@/Components/NavigationSidebarLink.vue';
import UserSettingsIcon from '@/Components/UserSettingsIcon.vue';
import MainContainer from '@/Components/src/MainContainer.vue';
import HomeIcon from '@/Components/Icons/HomeIcon.vue';
import ArrowsRightLeftIcon from '@/Components/Icons/ArrowsRightLeftIcon.vue';
import CalendarIcon from '@/Components/Icons/CalendarIcon.vue';
import ChartBarIcon from '@/Components/Icons/ChartBarIcon.vue';
import ClockIcon from '@/Components/Icons/ClockIcon.vue';
import Cog6ToothIcon from '@/Components/Icons/Cog6ToothIcon.vue';
import NotesIcon from '@/Components/Icons/NotesIcon.vue';
import FolderIcon from '@/Components/Icons/FolderIcon.vue';
import TagIcon from '@/Components/Icons/TagIcon.vue';
import EnvGroupIcon from '@/Components/Icons/EnvGroupIcon.vue';
import BookCheckIcon from '@/Components/Icons/BookCheckIcon.vue';
import SidebarIcon from '@/Components/Icons/SidebarIcon.vue';
//import ChatBot from '@/Pages/ChatBot.vue';

defineProps({
	title: String,
});

const router = useRouter();
const isConnecting = ref(null);
const isConnected = ref(false);
const showSidebarMenu = ref(false);

const showChat = ref(false);
const toggleChat = () => (showChat.value = !showChat.value);

function appTheme() {
	document.documentElement.classList.add(theme.value);
	watch(theme, (newTheme, oldTheme) => {
		document.documentElement.classList.remove(oldTheme);
		document.documentElement.classList.add(newTheme);
	});
}

onBeforeMount(() => {
	isConnecting.value = new Promise(async (resolve) => {
		const credentials = getCredentials();
		if (credentials) {
			const connected = await fetch('connection/middleware', { credentials });
			if (connected?.success) return resolve((isConnected.value = true));
		}
		router.push('/');
	});
});

onMounted(async () => {
	appTheme();
	await isConnecting.value;
	if (isConnected.value) {
		useModulesStore().fetchModules();
		useChapitresStore().fetchChapitres();
		useTachesStore().fetchTaches();
		useMinuteursStore().fetchMinuteurs();
	}
});
</script>

<template>
	<div v-if="isConnected" v-bind="$attrs" class="flex flex-wrap bg-background text-muted">
		<div
			:class="{ 'sidebar-open bg-default-background': showSidebarMenu }"
			class="flex-shrink-0 h-screen hidden fixed w-[230px] 2xl:w-[250px] px-2.5 2xl:px-3 py-4 lg:flex flex-col justify-between"
		>
			<div class="flex flex-col h-full">
				<div class="border-b border-default-background-separator">
					<CurrentSidebarTimer></CurrentSidebarTimer>
				</div>
				<div
					class="overflow-y-scroll flex-1 w-full"
					style="scrollbar-width: thin; scrollbar-color: var(--color-bg-primary) transparent"
				>
					<nav class="pt-2">
						<ul>
							<NavigationSidebarLink
								@click="showSidebarMenu = false"
								title="Accueil"
								:icon="HomeIcon"
								:href="route('dashboard')"
								:current="route.current('dashboard')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								@click="showSidebarMenu = false"
								title="Emploi du Temps"
								:icon="CalendarIcon"
								:current="route.current('emploi')"
								:href="route('emploi')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								@click="showSidebarMenu = false"
								title="Envirenement du travail"
								:icon="EnvGroupIcon"
								:current="route.current('env')"
								:href="route('env')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								@click="showSidebarMenu = false"
								title="Tempt"
								:icon="ClockIcon"
								:current="route.current('time')"
								:href="route('time')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								@click="showSidebarMenu = false"
								title="Rapport"
								:icon="ChartBarIcon"
								:current="route.current('rapport')"
								:href="route('rapport')"
							></NavigationSidebarLink>
						</ul>
					</nav>

					<div class="text-text-tertiary text-sm font-semibold pt-5 pb-1.5">Programme</div>

					<nav>
						<ul>
							<NavigationSidebarLink
								@click="showSidebarMenu = false"
								title="Modules"
								:icon="FolderIcon"
								:href="route('modules')"
								:current="route.current('modules')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								@click="showSidebarMenu = false"
								title="Chapitres"
								:icon="BookCheckIcon"
								:href="route('chapitres')"
								:current="route.current('chapitres')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								@click="showSidebarMenu = false"
								title="Tâches"
								:icon="TagIcon"
								:current="route.current('taches')"
								:href="route('taches')"
							></NavigationSidebarLink>
						</ul>
					</nav>
					<div class="text-text-tertiary text-sm font-semibold pt-5 pb-1.5">Documents</div>

					<nav>
						<ul>
							<NavigationSidebarLink
								@click="showSidebarMenu = false"
								title="Notes"
								:icon="NotesIcon"
								:current="route.current('notes')"
								:href="route('notes')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								@click="showSidebarMenu = false"
								title="Importer"
								:icon="ArrowsRightLeftIcon"
								:current="route.current('import')"
								:href="route('import')"
							></NavigationSidebarLink>
						</ul>
					</nav>
				</div>

				<div class="justify-self-end">
					<ul class="border-t border-default-background-separator pt-3 flex justify-between pr-4 items-center">
						<NavigationSidebarLink
							@click="showSidebarMenu = false"
							class="flex-1"
							title="Profile Settings"
							:icon="Cog6ToothIcon"
							:href="route('profile')"
						></NavigationSidebarLink>

						<UserSettingsIcon></UserSettingsIcon>
					</ul>
				</div>
			</div>
		</div>
		<div class="flex-1 lg:ml-[230px] 2xl:ml-[250px] min-w-0">
			<div class="app-branding flex items-center p-2 lg:hidden">
				<SidebarIcon @click="showSidebarMenu = !showSidebarMenu" />
				<h1>Etutime</h1>
			</div>
			<div class="min-h-screen bg-default-background border-l border-default-background-separator">
				<header v-if="$slots.header" class="bg-default-background border-b border-default-background-separator shadow">
					<div class="pt-8 pb-3">
						<MainContainer>
							<slot name="header"></slot>
						</MainContainer>
					</div>
				</header>

				<main class="pb-28">
					<slot></slot>
				</main>
			</div>
		</div>
	</div>
	<NotificationContainer></NotificationContainer>
	<!-- Ajoutez ceci avant </template> -->
	<div class="chat-icon-container" @click="toggleChat">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
		</svg>
	</div>

	<div v-if="showChat" class="chat-modal">
		<div class="chat-modal-content">
			<button class="chat-close-btn" @click="toggleChat">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
			<ChatBot />
		</div>
	</div>
</template>

<style scoped>
.app-branding h1 {
	font-size: 1.25rem;
	margin-left: 1rem;
	padding-top: 0.4rem;
	font-weight: 800;
	margin-bottom: 0.5rem;
	background: rgb(184, 233, 255);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1023.98px) {
	.sidebar-open {
		z-index: 9999999999;
		width: 100%;
		display: flex !important;
	}
}
.chat-icon-container {
	position: fixed;
	bottom: 20px;
	right: 20px;
	width: 50px;
	height: 50px;
	background-color: #1976d2;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	z-index: 1000;
	transition: all 0.3s ease;
}

.chat-icon-container:hover {
	background-color: #1565c0;
	transform: scale(1.1);
}

.chat-icon-container svg {
	color: white;
	width: 24px;
	height: 24px;
}
.chat-modal {
	position: fixed;
	bottom: 80px;
	right: 20px;
	width: 350px;
	height: 500px; /* Hauteur fixe */
	background-color: white;
	border-radius: 8px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.chat-modal-content {
	position: relative;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.chat-close-btn {
	position: absolute;
	top: 10px;
	right: 10px;
	background: none;
	border: none;
	cursor: pointer;
	z-index: 10;
	padding: 5px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.chat-close-btn:hover {
	background-color: #f5f5f5;
}

.chat-close-btn svg {
	width: 16px;
	height: 16px;
	color: #666;
}

/* Styles responsifs */
@media (max-width: 768px) {
	.chat-modal {
		width: 90%;
		right: 5%;
		bottom: 70px;
		max-height: 60vh;
	}

	.chat-icon-container {
		bottom: 15px;
		right: 15px;
		width: 45px;
		height: 45px;
	}
}
</style>
