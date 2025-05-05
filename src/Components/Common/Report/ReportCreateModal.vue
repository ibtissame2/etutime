<script setup>
import TextInput from '@/Components/src/Input/TextInput.vue';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import DialogModal from '@/Components/src/DialogModal.vue';
import { ref } from 'vue';
import PrimaryButton from '@/Components/src/Buttons/PrimaryButton.vue';
import InputLabel from '@/Components/src/Input/InputLabel.vue';
import { useMutation } from '@/utils/tanstack';
import { getCurrentOrganizationId } from '@/utils/useUser';
import Checkbox from '@/Components/src/Input/Checkbox.vue';
import DatePicker from '@/Components/src/Input/DatePicker.vue';
import { useNotificationsStore } from '@/utils/notification';

const show = defineModel('show', { default: false });
const saving = ref(false);

const createReportMutation = useMutation({
	mutationFn: async (report) => {
		const organizationId = getCurrentOrganizationId();
		if (organizationId === null) {
			throw new Error('No current organization id - create report');
		}
		return await api.createReport(report, {
			params: {
				organization: organizationId,
			},
		});
	},
});

const props = defineProps({
	properties: {
		type: Object,
		required: true,
	},
});

const report = ref({
	name: '',
	description: '',
	is_public: true,
	public_until: null,
});

const { handleApiRequestNotifications } = useNotificationsStore();

async function submit() {
	await handleApiRequestNotifications(
		() =>
			createReportMutation.mutateAsync({
				...report.value,
				properties: { ...props.properties },
			}),
		'Success',
		'Error',
		() => {
			report.value = {
				name: '',
				description: '',
				is_public: false,
				public_until: null,
			};
			show.value = false;
		}
	);
}
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span>Create Report</span>
			</div>
		</template>

		<template #content>
			<div class="items-center space-y-4 w-full">
				<div class="w-full">
					<InputLabel for="name" value="Name" />
					<TextInput id="name" v-model="report.name" class="mt-1.5 w-full"></TextInput>
				</div>
				<div>
					<InputLabel for="description" value="Description" />
					<TextInput id="description" v-model="report.description" class="mt-1.5 w-full"></TextInput>
				</div>
				<InputLabel value="Visibility" />
				<div class="flex items-center space-x-12">
					<div class="flex items-center space-x-3 px-2 py-3">
						<Checkbox id="is_public" v-model:checked="report.is_public"></Checkbox>
						<InputLabel for="is_public" value="Public" />
					</div>
					<div v-if="report.is_public" class="flex items-center space-x-4">
						<div>
							<InputLabel for="public_until" value="Expires at" />
							<div class="text-text-tertiary font-medium">(optional)</div>
						</div>
						<DatePicker id="public_until"></DatePicker>
					</div>
				</div>
			</div>
		</template>
		<template #footer>
			<SecondaryButton @click="show = false">Cancel</SecondaryButton>
			<PrimaryButton class="ms-3" :class="{ 'opacity-25': saving }" :disabled="saving" @click="submit">
				Create Report
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
