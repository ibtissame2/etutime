<script setup>
import { onMounted, ref, watch } from 'vue';
import { initializeStores, refreshStores } from '@/utils/init';
import { theme } from '@/utils/theme';
import OrganizationSwitcher from '@/Components/OrganizationSwitcher.vue';
import CurrentSidebarTimer from '@/Components/CurrentSidebarTimer.vue';
import NotificationContainer from '@/Components/NotificationContainer.vue';
import NavigationSidebarItem from '@/Components/NavigationSidebarItem.vue';
import UserSettingsIcon from '@/Components/UserSettingsIcon.vue';
import MainContainer from '@/packages/ui/src/MainContainer.vue';
import { canUpdateOrganization, canViewNotes, canViewMembers, canViewProjects, canViewTags } from '@/utils/permissions';
import { Head, route } from '@/utils/inertia';
import { fetchToken, isTokenValid } from '@/utils/session';
import HomeIcon from '@/Components/Icons/HomeIcon.vue';
import ArrowsRightLeftIcon from '@/Components/Icons/ArrowsRightLeftIcon.vue';
import CalendarIcon from '@/Components/Icons/CalendarIcon.vue';
import ChartBarIcon from '@/Components/Icons/ChartBarIcon.vue';
import ClockIcon from '@/Components/Icons/ClockIcon.vue';
import Cog6ToothIcon from '@/Components/Icons/Cog6ToothIcon.vue';
import NotesIcon from '@/Components/Icons/NotesIcon.vue';
import FolderIcon from '@/Components/Icons/FolderIcon.vue';
import TagIcon from '@/Components/Icons/TagIcon.vue';
import UserGroupIcon from '@/Components/Icons/UserGroupIcon.vue';
import EnvGroupIcon from '@/Components/Icons/EnvGroupIcon.vue';

defineProps({
	title: String,
});

const showSidebarMenu = ref(false);
const isUnloading = ref(false);

onMounted(async () => {
	document.documentElement.classList.add(theme.value);
	watch(theme, (newTheme, oldTheme) => {
		document.documentElement.classList.remove(oldTheme);
		document.documentElement.classList.add(newTheme);
	});

	if (window.initialDataLoaded !== true) {
		window.initialDataLoaded = true;
		initializeStores();
	}
	window.onbeforeunload = () => {
		isUnloading.value = true;
	};
	window.onfocus = async () => {
		if (!isTokenValid()) {
			await fetchToken();
		}
		setTimeout(() => {
			if (isUnloading.value === false) {
				refreshStores();
			}
		}, 100);
	};
});
</script>

<template>
	<div v-bind="$attrs" class="flex flex-wrap bg-background text-muted">
		<div
			:class="{
				'!flex bg-default-background w-full z-[9999999999]': showSidebarMenu,
			}"
			class="flex-shrink-0 h-screen hidden fixed w-[230px] 2xl:w-[250px] px-2.5 2xl:px-3 py-4 lg:flex flex-col justify-between"
		>
			<div class="flex flex-col h-full">
				<div class="border-b border-default-background-separator pb-2 flex justify-between">
					<OrganizationSwitcher class="w-full"></OrganizationSwitcher>
				</div>
				<div class="border-b border-default-background-separator">
					<CurrentSidebarTimer></CurrentSidebarTimer>
				</div>
				<div
					class="overflow-y-scroll flex-1 w-full"
					style="scrollbar-width: thin; scrollbar-color: var(--color-bg-primary) transparent"
				>
					<nav class="pt-2">
						<ul>
							<NavigationSidebarItem
								title="Accueil"
								:icon="HomeIcon"
								:href="route('dashboard')"
								:current="route.current('dashboard')"
							></NavigationSidebarItem>

							<NavigationSidebarItem
								title="Emploi du Temps"
								:icon="CalendarIcon"
								:current="route.current('emploi')"
								:href="route('emploi')"
							></NavigationSidebarItem>

							<NavigationSidebarItem
								title="Envirenement du travail"
								:icon="EnvGroupIcon"
								:current="route.current('env')"
								:href="route('env')"
							></NavigationSidebarItem>

							<NavigationSidebarItem
								title="Tempt"
								:icon="ClockIcon"
								:current="route.current('time')"
								:href="route(time)"
							></NavigationSidebarItem>

							<NavigationSidebarItem
								title="Rapport"
								:icon="ChartBarIcon"
								:current="route.current('reporting')"
								:href="route(rapport)"
							></NavigationSidebarItem>
						</ul>
					</nav>

					<div class="text-text-tertiary text-sm font-semibold pt-5 pb-1.5">Manage</div>

					<nav>
						<ul>
							<NavigationSidebarItem
								v-if="canViewProjects()"
								title="Modules"
								:icon="FolderIcon"
								:href="route('modules')"
								:current="route.current('modules')"
							></NavigationSidebarItem>

							<NavigationSidebarItem
								v-if="canViewMembers()"
								title="Etudiants"
								:icon="UserGroupIcon"
								:current="route.current('etudiants')"
								:href="route('etudiants')"
							></NavigationSidebarItem>

							<NavigationSidebarItem
								v-if="canViewTags()"
								title="Tags"
								:icon="TagIcon"
								:current="route.current('tags')"
								:href="route('tags')"
							></NavigationSidebarItem>
						</ul>
					</nav>
					<div v-if="canUpdateOrganization()" class="text-text-tertiary text-sm font-semibold pt-5 pb-1.5">
						Documents
					</div>

					<nav>
						<ul>
							<NavigationSidebarItem
								v-if="canViewNotes()"
								title="Notes"
								:icon="NotesIcon"
								:current="route.current('notes')"
								:href="route('notes')"
							></NavigationSidebarItem>

							<NavigationSidebarItem
								v-if="canUpdateOrganization()"
								title="Import"
								:icon="ArrowsRightLeftIcon"
								:current="route.current('import')"
								:href="route('import')"
							></NavigationSidebarItem>
						</ul>
					</nav>
				</div>
				<div class="justify-self-end">
					<ul class="border-t border-default-background-separator pt-3 flex justify-between pr-4 items-center">
						<NavigationSidebarItem
							class="flex-1"
							title="Profile Settings"
							:icon="Cog6ToothIcon"
							:href="route('profile')"
						></NavigationSidebarItem>

						<UserSettingsIcon></UserSettingsIcon>
					</ul>
				</div>
			</div>
		</div>
		<div class="flex-1 lg:ml-[230px] 2xl:ml-[250px] min-w-0">
			<!-- <Head :title="title" /> -->

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
