<script setup>
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import DialogModal from '@/packages/ui/src/DialogModal.vue';
import { ref } from 'vue';
import PrimaryButton from '@/packages/ui/src/Buttons/PrimaryButton.vue';
import { useFocus } from '@vueuse/core';
import { useProjectMembersStore } from '@/utils/useProjectMembers';
import MemberCombobox from '@/Components/Common/Member/MemberCombobox.vue';

const { createProjectMember } = useProjectMembersStore();
const show = defineModel('show', { default: false });
const saving = ref(false);

const props = defineProps({
	projectId: {
		type: String,
		required: true,
	},
	existingMembers: {
		type: Array,
		required: true,
	},
});

const projectMember = ref({
	member_id: '',
});

async function submit() {
	await createProjectMember(props.projectId, projectMember.value);
	show.value = false;
	projectMember.value = {
		member_id: '',
	};
}

const projectNameInput = ref(null);

useFocus(projectNameInput, { initialValue: true });
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span>Add Project Member</span>
			</div>
		</template>

		<template #content>
			<div class="grid grid-cols-3 items-center space-x-4">
				<div class="col-span-3 sm:col-span-2">
					<MemberCombobox v-model="projectMember.member_id" :hidden-members="existingMembers"></MemberCombobox>
				</div>
			</div>
		</template>
		<template #footer>
			<SecondaryButton @click="show = false">Cancel</SecondaryButton>
			<PrimaryButton class="ms-3" :class="{ 'opacity-25': saving }" :disabled="saving" @click="submit">
				Add Project Member
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
