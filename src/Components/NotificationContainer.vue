<script setup>
import Notification from '@/Components/Common/Notification/Notification.vue';
import { storeToRefs } from 'pinia';
import { useNotificationsStore } from '@/store/notification';

const { notifications } = storeToRefs(useNotificationsStore());
</script>

<template>
	<div
		aria-live="assertive"
		class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-end sm:p-6 sm:pb-24 z-[70]"
	>
		<div class="flex w-full flex-col items-center space-y-4 sm:items-end">
			<Notification
				v-for="notification in notifications"
				:key="notification.uuid"
				:type="notification.type"
				:title="notification.title"
				:message="notification.message"
			></Notification>
		</div>
	</div>
</template>
