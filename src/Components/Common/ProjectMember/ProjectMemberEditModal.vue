<script setup>
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import DialogModal from '@/packages/ui/src/DialogModal.vue';
import { ref, watch } from 'vue';
import PrimaryButton from '@/packages/ui/src/Buttons/PrimaryButton.vue';
import { useFocus } from '@vueuse/core';
import { useProjectMembersStore } from '@/utils/useProjectMembers';
import { UserIcon } from '@heroicons/vue/24/solid';
import InputLabel from '@/packages/ui/src/Input/InputLabel.vue';

const { updateProjectMember } = useProjectMembersStore();
const show = defineModel('show', { default: false });
const saving = ref(false);

const props = defineProps({
	projectMember: {
		type: Object,
		required: true,
	},
	name: {
		type: String,
		required: false,
	},
});

async function submit() {
	await updateProjectMember(props.projectMember.id);
	show.value = false;
}

const projectNameInput = ref(null);
useFocus(projectNameInput, { initialValue: true });
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span>Edit Project Member</span>
			</div>
		</template>

		<template #content>
			<div class="grid grid-cols-3 items-center space-x-4">
				<div class="col-span-3 sm:col-span-2 space-x-2 flex items-center">
					<UserIcon class="w-4 text-muted"></UserIcon>
					<span>{{ name }}</span>
				</div>
			</div>
		</template>
		<template #footer>
			<SecondaryButton @click="show = false">Cancel</SecondaryButton>
			<PrimaryButton class="ms-3" :class="{ 'opacity-25': saving }" :disabled="saving" @click="submit">
				Update Project Member
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
