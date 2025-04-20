<script setup>
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import ActionSection from '@/Components/ActionSection.vue';
import ConfirmationModal from '@/Components/ConfirmationModal.vue';
import DangerButton from '@/packages/ui/src/Buttons/DangerButton.vue';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';

const props = defineProps({
	team: {
		type: Object,
		required: true,
	},
});

const confirmingTeamDeletion = ref(false);
const form = useForm({});

const confirmTeamDeletion = () => {
	confirmingTeamDeletion.value = true;
};

const deleteTeam = () => {
	form.delete(route('teams.destroy', props.team), {
		errorBag: 'deleteTeam',
	});
};
</script>

<template>
	<ActionSection>
		<template #title> Delete Organization </template>

		<template #description> Permanently delete this organization. </template>

		<template #content>
			<div class="max-w-xl text-sm text-muted">
				Once an organization is deleted, all of its resources and data will be permanently deleted. Before deleting this
				organization, please download any data you wish to retain.
			</div>

			<div class="mt-5">
				<DangerButton @click="confirmTeamDeletion"> Delete Organization </DangerButton>
			</div>

			<ConfirmationModal :show="confirmingTeamDeletion" @close="confirmingTeamDeletion = false">
				<template #title> Delete Organization </template>

				<template #content> Are you sure you want to delete this organization? This action cannot be undone. </template>

				<template #footer>
					<SecondaryButton @click="confirmingTeamDeletion = false"> Cancel </SecondaryButton>

					<DangerButton
						class="ms-3"
						:class="{ 'opacity-25': form.processing }"
						:disabled="form.processing"
						@click="deleteTeam"
					>
						Delete Organization
					</DangerButton>
				</template>
			</ConfirmationModal>
		</template>
	</ActionSection>
</template>
