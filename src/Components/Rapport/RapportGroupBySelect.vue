<script setup>
import SelectDropdown from '@/Components/src/Input/SelectDropdown.vue';
import Badge from '@/Components/src/Badge.vue';
import { computed } from 'vue';

const model = defineModel({ default: null });

const props = defineProps({
	options: Array,
});

const selected = computed(() => {
	return props.options.find((option) => option.value === model.value);
});
</script>

<template>
	<SelectDropdown
		v-model="model"
		:get-key-from-item="(item) => item.value"
		:get-name-for-item="(item) => item.title"
		:items="options"
	>
		<template #trigger>
			<Badge v-if="selected" size="large" class="cursor-pointer hover:bg-card-background transition space-x-5 flex">
				<component :is="selected.icon" class="h-4 text-muted"></component>
				<span>{{ selected.title }}</span>
			</Badge>
		</template>
	</SelectDropdown>
</template>

<style scoped></style>
