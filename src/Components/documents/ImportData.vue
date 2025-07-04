<script setup>
import PrimaryButton from '@/Components/src/Buttons/PrimaryButton.vue';
import { computed, ref } from 'vue';
import { useNotificationsStore } from '@/store/notification';
import InputLabel from '@/Components/src/Input/InputLabel.vue';
import { DocumentIcon } from '@heroicons/vue/24/solid';
import { ArrowDownOnSquareIcon } from '@heroicons/vue/24/outline';

import DialogModal from '@/Components/src/DialogModal.vue';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
// import { initializeStores } from '@/store/init';
import CardTitle from '@/Components/src/CardTitle.vue';
import Card from '@/Components/Common/Card.vue';

const importTypeOptions = ref([]);

const { addNotification } = useNotificationsStore();

const loading = ref(false);

const reportResult = ref(null);
const files = ref(null);

async function importData() {
	if (importType.value === null) {
		addNotification('error', 'Please select the import type');
		return;
	}
	if (files.value?.length !== 1) {
		addNotification('error', 'Please select the CSV or ZIP file that you want to import');
		return;
	}
}

const importFile = ref(null);

function toBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			if (reader.result instanceof ArrayBuffer) {
				const decoder = new TextDecoder();
				const str = decoder.decode(reader.result);
				return reject(str);
			} else if (reader.result) {
				resolve(reader.result);
			}
		};
		reader.onerror = reject;
	});
}

function updateFiles() {
	files.value = importFile.value?.files ?? null;
}

const currentImporterDescription = computed(() => {
	if (importType.value === null) {
		return '';
	}
	return importType.value.description;
});

const filenames = computed(() => {
	return files.value?.item(0)?.name ?? 'Import File selected';
});

const importType = ref(null);

const showResultModal = ref(false);
</script>

<template>
	<DialogModal closeable :show="showResultModal" @close="showResultModal = false">
		<template #title>Import Result</template>
		<template #content>
			<div class="pb-6">The import was successful! Here is an overview of the imported data:</div>
			<div class="py-2.5 px-3 border-t border-t-card-background-separator">
				<span class="text-text-primary font-semibold">Projects created:</span>
				{{ reportResult?.report.projects.created }}
			</div>
			<div class="py-2.5 px-3 border-t border-t-card-background-separator">
				<span class="text-text-primary font-semibold">Tasks created:</span>
				{{ reportResult?.report.tasks.created }}
			</div>
			<div class="py-2.5 px-3 border-t border-t-card-background-separator">
				<span class="text-text-primary font-semibold">Time entries created:</span>
				{{ reportResult?.report.time_entries.created }}
			</div>
		</template>
		<template #footer>
			<SecondaryButton @click="showResultModal = false"> Close </SecondaryButton>
		</template>
	</DialogModal>
	<div>
		<CardTitle title="Importer des données" :icon="ArrowDownOnSquareIcon"></CardTitle>

		<Card>
			<div class="px-4 py-5 sm:px-5">
				<div>
					<InputLabel for="importType" value="Type d'importation" />
					<select
						id="importType"
						v-model="importType"
						name="importType"
						class="mt-1 block w-full border-input-border bg-input-background text-text-primary focus:border-input-border-active rounded-md shadow-sm"
					>
						<option :value="null" selected disabled>Sélectionnez un type d'importation...</option>
						<option v-for="importTypeOption in importTypeOptions" :key="importTypeOption.key" :value="importTypeOption">
							{{ importTypeOption.name }}
						</option>
					</select>
					<div v-if="currentImporterDescription" class="py-3 text-text-primary">
						<div class="font-semibold text-muted py-1">Instructions:</div>
						<div class="max-w-2xl" v-html="currentImporterDescription"></div>
					</div>
				</div>

				<div class="mt-2 flex justify-center rounded-lg border border-dashed border-border-primary px-6 py-10">
					<div class="text-center">
						<DocumentIcon class="mx-auto h-8 w-8 text-muted" aria-hidden="true" />

						<div class="mt-4 flex text-sm leading-6 text-muted">
							<label
								for="file-upload"
								class="relative cursor-pointer rounded-md font-semibold text-text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
							>
								<span v-if="files">{{ filenames }}</span>
								<span v-else>Désposez vos fichiers ici</span>
								<input
									id="file-upload"
									ref="importFile"
									name="file-upload"
									type="file"
									class="sr-only"
									@change="updateFiles"
								/>
							</label>
						</div>
						<p class="text-xs leading-5 text-muted">
							Support pour PDF,<br />
							DOCX,XLSX,Images
						</p>
					</div>
				</div>
			</div>

			<div
				class="flex items-center justify-end px-4 py-3 bg-card-background border-t border-card-background-separator text-end sm:px-6 shadow sm:rounded-bl-md sm:rounded-br-md"
			>
				<PrimaryButton :loading @click="importData">Importer des données</PrimaryButton>
			</div>
		</Card>
	</div>
</template>
