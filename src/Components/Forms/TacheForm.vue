<script setup>
import { ref } from 'vue';
import { useFocus } from '@vueuse/core';
import { useTachesStore } from '@/store/taches';
import TextInput from '@/Components/src/Input/TextInput.vue';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import PrimaryButton from '@/Components/src/Buttons/PrimaryButton.vue';
import DialogModal from '@/Components/src/DialogModal.vue';

const { createTache } = useTachesStore();

const show = defineModel('show', { default: false });
const loading = ref(false);
const tache = ref({});

const extractData = (tache) => {
	return { name: tache?.name || '' };
};

const clearData = () => {
	tache.value = extractData(null);
	show.value = false;
};

function setDataOf(element) {
	tache.value = extractData(element || null);
	show.value = true;
}

async function submit() {
	loading.value = true;
	await createTache(tache.value, () => clearData());
	loading.value = false;
}

const tagNameInput = ref(null);
useFocus(tagNameInput, { initialValue: true });

defineExpose({ setDataOf });
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span>Créer une tâche</span>
			</div>
		</template>
		<template #content>
			<div class="flex items-center space-x-4">
				<div class="col-span-6 sm:col-span-4 flex-1">
					<TextInput
						id="tagName"
						ref="tagNameInput"
						v-model="tache.name"
						type="text"
						placeholder="Nom du tâche"
						class="mt-1 block w-full"
						required
						autocomplete="tagName"
						@keydown.enter="submit"
					/>
				</div>
			</div>
		</template>
		<template #footer>
			<SecondaryButton @click="show = false">Annuler</SecondaryButton>

			<PrimaryButton class="ms-3" :class="{ 'opacity-25': loading }" :disabled="loading" @click="submit">
				Créer
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
