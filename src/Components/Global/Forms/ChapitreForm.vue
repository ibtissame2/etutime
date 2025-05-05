<script setup>
import { ref, watch } from 'vue';
import { useFocus } from '@vueuse/core';
import { useChapitresStore } from '@/store/chapitres';
import DialogModal from '@/packages/ui/src/DialogModal.vue';
import TextInput from '@/packages/ui/src/Input/TextInput.vue';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import PrimaryButton from '@/packages/ui/src/Buttons/PrimaryButton.vue';
import ModuleDropdown from '@/Components/Common/Module/ModuleDropdown.vue';

const { createChapitre, updateChapitre } = useChapitresStore();

const props = defineProps({
	origin: { type: Object, required: false },
});

const show = defineModel('show', { default: false });
const loading = ref(false);
const chapitre = ref({});

const getFormData = () => {
	return { name: props.origin?.name || '', module_id: props.origin?.module_id || null };
};

const resetFormData = (hide = true) => {
	chapitre.value = getFormData();
	if (hide) show.value = false;
};

watch(
	() => props.origin,
	() => resetFormData(false)
);

async function submit() {
	loading.value = true;
	if (props.origin) await updateChapitre(props.origin.id, chapitre.value, () => resetFormData());
	else await createChapitre(chapitre.value, () => resetFormData());
	loading.value = false;
}

const nameInput = ref(null);
useFocus(nameInput, { initialValue: true });
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span>Saisie manuelle du temps</span>
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
			<PrimaryButton tabindex="2" class="ms-3" :class="{ 'opacity-25': saving }" :disabled="saving" @click="submit">
				Créer
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
