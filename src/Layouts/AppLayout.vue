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

defineProps({
	title: String,
});

const router = useRouter();
const isConnecting = ref(null);
const isConnected = ref(false);
const showSidebarMenu = ref(false);

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
			:class="{
				'!flex bg-default-background w-full z-[9999999999]': showSidebarMenu,
			}"
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
								title="Accueil"
								:icon="HomeIcon"
								:href="route('dashboard')"
								:current="route.current('dashboard')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								title="Emploi du Temps"
								:icon="CalendarIcon"
								:current="route.current('emploi')"
								:href="route('emploi')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								title="Envirenement du travail"
								:icon="EnvGroupIcon"
								:current="route.current('env')"
								:href="route('env')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								title="Tempt"
								:icon="ClockIcon"
								:current="route.current('time')"
								:href="route('time')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
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
								title="Modules"
								:icon="FolderIcon"
								:href="route('modules')"
								:current="route.current('modules')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
								title="Chapitres"
								:icon="BookCheckIcon"
								:href="route('chapitres')"
								:current="route.current('chapitres')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
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
								title="Notes"
								:icon="NotesIcon"
								:current="route.current('notes')"
								:href="route('notes')"
							></NavigationSidebarLink>

							<NavigationSidebarLink
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
</template>
