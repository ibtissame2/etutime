<script setup>
import { twMerge } from 'tailwind-merge';

defineProps({
	href: {
		type: String,
		required: false,
	},
});
</script>

<template>
	<Component
		:is="href ? 'router-link' : 'div'"
		:href="href"
		role="row"
		:class="
			twMerge(
				'contents group [&>*]:transition [&>*]:border-row-separator [&>*]:bg-row-background [&>*]:border-b',
				href ? '[&>*]:cursor-pointer [&>*]:hover:bg-white/5' : ''
			)
		"
	>
		<slot></slot>
	</Component>
</template>

<style scoped></style>
