<script setup>
import { ref } from 'vue';
import { useForm, usePage } from '@/utils/inertia';
import ActionMessage from '@/Components/ActionMessage.vue';
import ActionSection from '@/Components/ActionSection.vue';
import Checkbox from '@/packages/ui/src/Input/Checkbox.vue';
import ConfirmationModal from '@/Components/ConfirmationModal.vue';
import DangerButton from '@/packages/ui/src/Buttons/DangerButton.vue';
import DialogModal from '@/packages/ui/src/DialogModal.vue';
import FormSection from '@/Components/FormSection.vue';
import InputError from '@/packages/ui/src/Input/InputError.vue';
import InputLabel from '@/packages/ui/src/Input/InputLabel.vue';
import PrimaryButton from '@/packages/ui/src/Buttons/PrimaryButton.vue';
import SecondaryButton from '@/packages/ui/src/Buttons/SecondaryButton.vue';
import SectionBorder from '@/Components/SectionBorder.vue';
import TextInput from '@/packages/ui/src/Input/TextInput.vue';

const props = defineProps({
	tokens: {
		type: Array,
		required: true,
	},
	availablePermissions: {
		type: Array,
		required: true,
	},
});

const page = usePage();

const createApiTokenForm = useForm({ name: '' });
const updateApiTokenForm = useForm({});
const deleteApiTokenForm = useForm({});

const displayingToken = ref(false);
const managingPermissionsFor = ref(null);
const apiTokenBeingDeleted = ref(null);

const createApiToken = () => {
	createApiTokenForm.post(route('api-tokens.store'), {
		preserveScroll: true,
		onSuccess: () => {
			displayingToken.value = true;
			createApiTokenForm.reset();
		},
	});
};

const updateApiToken = () => {
	updateApiTokenForm.put(route('api-tokens.update', managingPermissionsFor.value?.id), {
		preserveScroll: true,
		preserveState: true,
		onSuccess: () => (managingPermissionsFor.value = null),
	});
};

const confirmApiTokenDeletion = (token) => {
	apiTokenBeingDeleted.value = token;
};

const deleteApiToken = () => {
	deleteApiTokenForm.delete(route('api-tokens.destroy', apiTokenBeingDeleted.value?.id), {
		preserveScroll: true,
		preserveState: true,
		onSuccess: () => (apiTokenBeingDeleted.value = null),
	});
};
</script>

<template>
	<AppLayout title="API Tokens">
		<template #header>
			<h2 class="font-semibold text-xl text-text-primary leading-tight">API Tokens</h2>
		</template>

		<div>
			<div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
				<div>
					<FormSection @submitted="createApiToken">
						<template #title>Create API Token</template>

						<template #description>
							API tokens allow third-party services to authenticate with our application on your behalf.
						</template>

						<template #form>
							<div class="col-span-6 sm:col-span-4">
								<InputLabel for="name" value="Name" />
								<TextInput
									id="name"
									v-model="createApiTokenForm.name"
									type="text"
									class="mt-1 block w-full"
									autofocus
								/>
								<InputError :message="createApiTokenForm.errors.name" class="mt-2" />
							</div>
						</template>

						<template #actions>
							<ActionMessage :on="createApiTokenForm.recentlySuccessful" class="me-3"> Created. </ActionMessage>

							<PrimaryButton
								:class="{ 'opacity-25': createApiTokenForm.processing }"
								:disabled="createApiTokenForm.processing"
							>
								Create
							</PrimaryButton>
						</template>
					</FormSection>

					<div v-if="tokens.length > 0">
						<SectionBorder />

						<div class="mt-10 sm:mt-0">
							<ActionSection>
								<template #title>Manage API Tokens</template>

								<template #description>
									You may delete any of your existing tokens if they are no longer needed.
								</template>

								<template #content>
									<div class="space-y-6">
										<div v-for="token in tokens" :key="token.id" class="flex items-center justify-between">
											<div class="break-all text-text-primary">
												{{ token.name }}
											</div>

											<div class="flex items-center ms-2">
												<div v-if="token.last_used_ago" class="text-sm text-gray-400">
													Last used {{ token.last_used_ago }}
												</div>

												<button
													class="cursor-pointer ms-6 text-sm text-red-500"
													@click="confirmApiTokenDeletion(token)"
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								</template>
							</ActionSection>
						</div>
					</div>

					<DialogModal :show="displayingToken" @close="displayingToken = false">
						<template #title>API Token</template>

						<template #content>
							<div>Please copy your new API token. For your security, it won't be shown again.</div>

							<div
								v-if="page.props.jetstream.flash.token"
								class="mt-4 bg-card-background px-4 py-2 rounded font-mono text-sm text-gray-500 break-all"
							>
								{{ page.props.jetstream.flash.token }}
							</div>
						</template>

						<template #footer>
							<SecondaryButton @click="displayingToken = false"> Close </SecondaryButton>
						</template>
					</DialogModal>

					<DialogModal :show="managingPermissionsFor != null" @close="managingPermissionsFor = null">
						<template #content>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">Ibtissame</div>
						</template>

						<template #footer>
							<SecondaryButton @click="managingPermissionsFor = null"> Cancel </SecondaryButton>

							<PrimaryButton
								class="ms-3"
								:class="{ 'opacity-25': updateApiTokenForm.processing }"
								:disabled="updateApiTokenForm.processing"
								@click="updateApiToken"
							>
								Save
							</PrimaryButton>
						</template>
					</DialogModal>

					<ConfirmationModal :show="apiTokenBeingDeleted != null" @close="apiTokenBeingDeleted = null">
						<template #title>Delete API Token</template>

						<template #content> Are you sure you would like to delete this API token? </template>

						<template #footer>
							<SecondaryButton @click="apiTokenBeingDeleted = null"> Cancel </SecondaryButton>

							<DangerButton
								class="ms-3"
								:class="{ 'opacity-25': deleteApiTokenForm.processing }"
								:disabled="deleteApiTokenForm.processing"
								@click="deleteApiToken"
							>
								Delete
							</DangerButton>
						</template>
					</ConfirmationModal>
				</div>
			</div>
		</div>
	</AppLayout>
</template>
