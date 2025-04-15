<script setup>
import { onMounted, ref, watch } from 'vue';
import { initializeStores, refreshStores } from '@/utils/init';
import { theme } from '@/utils/theme';
// import { Bars3Icon, ChartBarIcon, ClockIcon, Cog6ToothIcon, CreditCardIcon, FolderIcon, HomeIcon,
//     TagIcon, UserCircleIcon, UserGroupIcon, XMarkIcon } from '@heroicons/vue/20/solid';
// import { ArrowsRightLeftIcon } from '@heroicons/vue/16/solid';
import OrganizationSwitcher from '@/Components/OrganizationSwitcher.vue';
import CurrentSidebarTimer from '@/Components/CurrentSidebarTimer.vue';
import NotificationContainer from '@/Components/NotificationContainer.vue';
import NavigationSidebarItem from '@/Components/NavigationSidebarItem.vue';
import UserSettingsIcon from '@/Components/UserSettingsIcon.vue';
import MainContainer from '@/packages/ui/src/MainContainer.vue';
import BannerEl from '@/Components/BannerEl.vue';
import BillingBanner from '@/Components/Billing/BillingBanner.vue';
import {
	canManageBilling,
	canUpdateOrganization,
	canViewClients,
	canViewMembers,
	canViewProjects,
	canViewReport,
	canViewTags,
} from '@/utils/permissions';
import { isBillingActivated } from '@/utils/billing';
import { route, usePage } from '../utils/inertia';
// import { Head } from '@inertiajs/vue3';
import { fetchToken, isTokenValid } from '@/utils/session';

defineProps({
	title: String,
});

const page = usePage();

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
					<!-- <XMarkIcon class="w-8 lg:hidden" @click="showSidebarMenu = false"></XMarkIcon> -->
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
								title="Dashboard"
								:icon="undefined"
								href="dashboard"
								:current="route.isCurrent('dashboard')"
							></NavigationSidebarItem>
							<NavigationSidebarItem title="Time" :icon="undefined" :current="route.isCurrent('time')" href="time">
							</NavigationSidebarItem>

							<NavigationSidebarItem
								title="Reporting"
								:icon="undefined"
								:sub-items="[
									{
										title: 'Overview',
										route: 'reporting',
										show: true,
									},
									{
										title: 'Detailed',
										route: 'reporting.detailed',
										show: true,
									},
									{
										title: 'Shared',
										route: 'reporting.shared',
										show: canViewReport(),
									},
								]"
								:current="
									route.isCurrent('reporting') ||
									route.isCurrent('reporting.detailed') ||
									route.isCurrent('reporting.shared')
								"
								href="reporting"
							>
							</NavigationSidebarItem>
						</ul>
					</nav>

					<div class="text-text-tertiary text-sm font-semibold pt-5 pb-1.5">Manage</div>

					<nav>
						<ul>
							<NavigationSidebarItem
								v-if="canViewProjects()"
								title="Modules"
								:icon="undefined"
								href="/modules"
								:current="route.isCurrent('modules')"
							></NavigationSidebarItem>
							<NavigationSidebarItem
								v-if="canViewMembers()"
								title="Etudiants"
								:icon="undefined"
								:current="route.isCurrent('etudiants')"
								href="/etudiants"
							></NavigationSidebarItem>
							<NavigationSidebarItem
								v-if="canViewTags()"
								title="Tags"
								:icon="undefined"
								:current="route.isCurrent('tags')"
								href="tags"
							></NavigationSidebarItem>
						</ul>
					</nav>
					<div v-if="canUpdateOrganization()" class="text-text-tertiary text-sm font-semibold pt-5 pb-1.5">
						Documents
					</div>

					<nav>
						<ul>
							<NavigationSidebarItem
								v-if="canUpdateOrganization()"
								title="Notes"
								:icon="undefined"
								:current="route.isCurrent('notes')"
								href="/notes"
							/>
							<NavigationSidebarItem
								v-if="canUpdateOrganization()"
								title="Import / Export"
								:icon="undefined"
								:current="route.isCurrent('import')"
								href="import"
							/>
						</ul>
					</nav>
				</div>
				<div class="justify-self-end">
					<ul class="border-t border-default-background-separator pt-3 flex justify-between pr-4 items-center">
						<NavigationSidebarItem class="flex-1" title="Profile Settings" :icon="undefined" href="profile">
						</NavigationSidebarItem>

						<UserSettingsIcon></UserSettingsIcon>
					</ul>
				</div>
			</div>
		</div>
		<div class="flex-1 lg:ml-[230px] 2xl:ml-[250px] min-w-0">
			<div
				class="lg:hidden w-full px-3 py-1 border-b border-b-default-background-separator text-muted flex justify-between items-center"
			>
				<!-- <Bars3Icon class="w-7 text-muted" @click="showSidebarMenu = !showSidebarMenu"></Bars3Icon> -->
				<OrganizationSwitcher></OrganizationSwitcher>
			</div>
			<!-- <Head :title="title" /> -->

			<BannerEl />
			<BillingBanner v-if="isBillingActivated()" />

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
