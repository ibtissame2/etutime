<script setup>
import { router, route } from '@/utils/inertia';
import TabBar from '@/Components/Common/TabBar/TabBar.vue';
import TabBarItem from '@/Components/Common/TabBar/TabBarItem.vue';

defineProps({
	active: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<TabBar>
		<TabBarItem :active="active === 'reporting'" @click="router.visit(route('reporting'))">Overview</TabBarItem>
		<TabBarItem :active="active === 'detailed'" @click="router.visit(route('reporting.detailed'))">Detailed</TabBarItem>
		<TabBarItem :active="active === 'shared'" @click="router.visit(route('reporting.shared'))">Shared</TabBarItem>
	</TabBar>
</template>

<style scoped></style>
