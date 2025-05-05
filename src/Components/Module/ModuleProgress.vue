<script setup>
import { computed } from 'vue';
import MoreOptionsDropdown from '@/Components/src/MoreOptionsDropdown.vue';
import { useModulesStore } from '@/store/modules';

const { updateModule } = useModulesStore();

const props = defineProps({
	module: {
		type: Object,
		default: true,
	},
});

const options = [
	{ value: 'Début', color: '#15de5f' },
	{ value: 'En cours', color: '#e7b22c' },
	{ value: 'Fin', color: '#ec2072' },
];

const correntColor = computed(() => {
	return options.find((option) => option.value === props.module.progress).color;
});

function change(progress) {
	updateModule(props.module.id, { progress });
}
</script>

<template>
	<MoreOptionsDropdown :label="'Actions for Project ' + props.module.name" :trigger-slot="true">
		<template #trigger>
			<div :style="{ backgroundColor: correntColor }" class="w-3 h-3 mr-2 rounded-full"></div>
			<span>{{ props.module.progress }}</span>
		</template>
		<div class="min-w-[150px]">
			<button
				v-for="option in options"
				:key="option.value"
				:aria-label="'Archive Project ' + props.module.name"
				class="flex items-center space-x-3 w-full px-3 py-2.5 text-start text-sm font-medium leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out"
				@click="change(option.value)"
			>
				<div :style="{ backgroundColor: option.color }" class="w-3 h-3 rounded-full"></div>
				<span>{{ option.value }}</span>
			</button>
		</div>
	</MoreOptionsDropdown>
</template>
