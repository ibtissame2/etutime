import { ref } from 'vue';

export const layers = ref([]);

export function isLastLayer(id) {
	return layers.value[layers.value.length - 1] === id;
}
