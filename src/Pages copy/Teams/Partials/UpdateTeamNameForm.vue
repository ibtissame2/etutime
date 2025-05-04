<script setup>
import { useForm } from '@/utils/inertia';
import ActionMessage from '@/Components/ActionMessage.vue';
import FormSection from '@/Components/FormSection.vue';
import InputError from '@/packages/ui/src/Input/InputError.vue';
import InputLabel from '@/packages/ui/src/Input/InputLabel.vue';
import PrimaryButton from '@/packages/ui/src/Buttons/PrimaryButton.vue';
import TextInput from '@/packages/ui/src/Input/TextInput.vue';
import { CreditCardIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
	team: Object,
});

const form = useForm({
	name: props.team.name,
});

const updateTeamName = () => {
	form.put(route('teams.update', props.team.id), {
		errorBag: 'updateTeamName',
		preserveScroll: true,
	});
};
</script>

<template>
	<FormSection @submitted="updateTeamName">
		<template #title> Organization Name</template>

		<template #description> The organization's name and owner information. </template>

		<template #form>
			<div class="col-span-6 flex items-center justify-between">
				<div class="">
					<InputLabel value="Organization Owner" />

					<div class="flex items-center mt-2">
						<img
							class="w-12 h-12 rounded-full object-cover"
							:src="team.owner.profile_photo_url"
							:alt="team.owner.name"
						/>

						<div class="ms-4 leading-tight">
							<div class="text-text-primary">
								{{ team.owner.name }}
							</div>
							<div class="text-muted text-sm">
								{{ team.owner.email }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="col-span-6 sm:col-span-4">
				<InputLabel for="name" value="Organization Name" />

				<TextInput id="name" v-model="form.name" type="text" class="mt-1 block w-full" />

				<InputError :message="form.errors.name" class="mt-2" />
			</div>
		</template>

		<template #actions>
			<ActionMessage :on="form.recentlySuccessful" class="me-3"> Saved. </ActionMessage>

			<PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing"> Save </PrimaryButton>
		</template>
	</FormSection>
</template>
