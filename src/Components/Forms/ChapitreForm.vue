<script setup>
import { ref, watch } from 'vue';
import { useFocus } from '@vueuse/core';
import { useChapitresStore } from '@/store/chapitres';
import DialogModal from '@/Components/src/DialogModal.vue';
import TextInput from '@/Components/src/Input/TextInput.vue';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import PrimaryButton from '@/Components/src/Buttons/PrimaryButton.vue';
import ModuleDropdown from '@/Components/Module/ModuleDropdown.vue';

const { createChapitre, updateChapitre } = useChapitresStore();

const show = defineModel('show', { default: false });
const loading = ref(false);
const chapitre = ref({});

const extractData = (chapitre) => {
	return {
		id: chapitre?.id,
		name: chapitre?.name || '',
		module_id: chapitre?.module_id || null,
	};
};

const clearData = () => {
	chapitre.value = extractData(null);
	show.value = false;
};

function setDataOf(element) {
	chapitre.value = extractData(element || null);
	show.value = true;
}

async function submit() {
	loading.value = true;
	if (chapitre.value.id) await updateChapitre(chapitre.value.id, chapitre.value, () => clearData());
	else await createChapitre(chapitre.value, () => clearData());
	loading.value = false;
}

const nameInput = ref(null);
useFocus(nameInput, { initialValue: true });

defineExpose({ setDataOf });
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span>{{ chapitre.id ? 'Modifier le chapitre' : 'Créer un chapitre' }}</span>
			</div>
		</template>

		<template #content>
			<div class="sm:flex items-end space-y-2 sm:space-y-0 sm:space-x-4">
				<div class="flex-1">
					<TextInput
						id="name"
						ref="nameInput"
						v-model="chapitre.name"
						placeholder="Sur quoi as-tu travaillé ?"
						type="text"
						class="mt-1 block w-full"
						@keydown.enter="submit"
					/>
				</div>
			</div>
			<div class="sm:flex justify-between items-end space-y-2 sm:space-y-0 pt-4 sm:space-x-4">
				<ModuleDropdown full class="w-full flex-1" v-model="chapitre.module_id" />
			</div>
		</template>

		<template #footer>
			<SecondaryButton tabindex="2" @click="show = false">Annuler</SecondaryButton>
			<PrimaryButton tabindex="2" class="ms-3" :class="{ 'opacity-25': loading }" :disabled="loading" @click="submit">
				{{ chapitre.id ? 'Modifier' : 'Créer' }}
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
