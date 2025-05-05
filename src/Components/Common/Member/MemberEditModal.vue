<script setup>
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import DialogModal from '@/Components/src/DialogModal.vue';
import { computed, ref } from 'vue';
import PrimaryButton from '@/Components/src/Buttons/PrimaryButton.vue';
import { useMembersStore } from '@/utils/useMembers';
import InputLabel from '@/Components/src/Input/InputLabel.vue';
import MemberRoleSelect from '@/Components/Common/Member/MemberRoleSelect.vue';
import MemberOwnershipTransferConfirmModal from '@/Components/Common/Member/MemberOwnershipTransferConfirmModal.vue';

const { updateMember } = useMembersStore();
const show = defineModel('show', { default: false });
const saving = ref(false);

const props = defineProps({
	member: Object,
});

const memberBody = ref({
	role: props.member.role,
});

async function submit() {
	await updateMember(props.member.id, memberBody.value);
	show.value = false;
	showOwnershipTransferConfirmModal.value = false;
}

const showOwnershipTransferConfirmModal = ref(false);

function saveWithChecks() {
	if (memberBody.value.role === 'owner' && props.member.role !== 'owner') {
		show.value = false;
		showOwnershipTransferConfirmModal.value = true;
	}
}

const roleDescriptionTexts = {
	owner:
		'The owner has full access of the organization. The owner is the only role that can: delete the organization, transfer the ownership to another user',
	admin: 'The admin has full access to the organization, except for the stuff that only the owner can do.',
	manager:
		'The manager has full access to modules, tâches, time entries, and reports, but can not manage the organization or the users.',
	employee: 'An employee is a user that is only using the application to track time, but has no administrative rights.',
	placeholder:
		'Placeholder users can not do anything in the organization. They can be used to remove users from the organization without deleting their time entries.',
};

const roleDescription = computed(() => {
	if (memberBody.value.role && memberBody.value.role in roleDescriptionTexts) {
		return roleDescriptionTexts[memberBody.value.role];
	}
	return '';
});
</script>

<template>
	<MemberOwnershipTransferConfirmModal
		v-model:show="showOwnershipTransferConfirmModal"
		:member-name="member.name"
		@submit="submit"
	></MemberOwnershipTransferConfirmModal>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span> Update Member </span>
			</div>
		</template>

		<template #content>
			<div class="pb-5 pt-2 divide-y divide-border-secondary">
				<div class="pb-5 flex space-x-6">
					<div>
						<InputLabel for="role" value="Role" />
						<MemberRoleSelect v-model="memberBody.role" class="mt-2" name="role"></MemberRoleSelect>
					</div>
					<div class="flex-1 text-xs flex items-center pt-6">
						<p>{{ roleDescription }}</p>
					</div>
				</div>
				<div class="flex items-center space-x-4 pt-5">
					<div class="col-span-6 sm:col-span-4 flex-1 flex space-x-5"></div>
				</div>
			</div>
		</template>
		<template #footer>
			<SecondaryButton @click="show = false"> Cancel</SecondaryButton>

			<PrimaryButton class="ms-3" :class="{ 'opacity-25': saving }" :disabled="saving" @click="saveWithChecks()">
				Update Member
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
