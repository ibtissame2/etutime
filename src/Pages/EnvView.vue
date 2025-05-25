<script setup>
import MainContainer from '@/Components/src/MainContainer.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { UserGroupIcon, BookOpenIcon } from '@heroicons/vue/20/solid';
import TabBar from '@/Components/Common/TabBar/TabBar.vue';
import TabBarItem from '@/Components/Common/TabBar/TabBarItem.vue';
import { ref, onBeforeUnmount, computed, onMounted } from 'vue';
import PageTitle from '@/Components/Common/PageTitle.vue';
import { storeToRefs } from 'pinia';
import { useMinuteursStore } from '@/store/minuteurs';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';


defineProps({
	availableRoles: Array,
});

const activeTab = ref('all');
function isActiveTab(tab) {
	return activeTab.value === tab;
}
</script>

<template>
	<AppLayout title="Environnement">
		<MainContainer class="py-5 border-b border-default-background-separator flex justify-between items-center">
			<div class="flex items-center space-x-4 sm:space-x-6">
				<PageTitle :icon="UserGroupIcon" title="Environnement"> </PageTitle>
				<TabBar>
					<TabBarItem :active="isActiveTab('all')" @click="activeTab = 'all'">All</TabBarItem>
					<TabBarItem :active="isActiveTab('invitations')" @click="activeTab = 'invitations'">Invitations</TabBarItem>
				</TabBar>
			</div>
		</MainContainer>
		<MemberTable v-if="activeTab === 'all'"></MemberTable>
		<InvitationTable v-if="activeTab === 'invitations'"></InvitationTable>
	</AppLayout>
</template>
