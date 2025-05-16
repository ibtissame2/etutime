<script setup>
import { ref, watch } from 'vue';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { useChapitresStore } from '@/store/chapitres';
import { useTachesStore } from '@/store/taches';
import { useMinuteursStore } from '@/store/minuteurs';
import { TagIcon, InformationCircleIcon } from '@heroicons/vue/20/solid';
import SecondaryButton from '@/Components/src/Buttons/SecondaryButton.vue';
import DialogModal from '@/Components/src/DialogModal.vue';
import PrimaryButton from '@/Components/src/Buttons/PrimaryButton.vue';
import TimeTrackerDropdown from '@/Components/TimeTracker/TimeTrackerDropdown.vue';
import InputLabel from '@/Components/src/Input/InputLabel.vue';
import TagDropdown from '@/Components/Common/Tag/TagDropdown.vue';
import Badge from '@/Components/src/Badge.vue';
import DatePicker from '@/Components/src/Input/DatePicker.vue';
import DurationHumanInput from '@/Components/src/Input/DurationHumanInput.vue';
import TimePickerSimple from '@/Components/src/Input/TimePickerSimple.vue';

const show = defineModel('show', { default: false });
const loading = ref(false);

const { chapitres } = storeToRefs(useChapitresStore());
const { taches } = storeToRefs(useTachesStore());
const { toggleStartStopMinuteur } = useMinuteursStore();

const timeEntryDefaultValues = {
	chapitre_id: null,
	module_id: null,
	taches: [],
	start: dayjs().subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss'),
	end: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

const minuteur = ref({ ...timeEntryDefaultValues });

const localStart = ref(timeEntryDefaultValues.start);

const localEnd = ref(timeEntryDefaultValues.end);

watch(localStart, (value) => {
	minuteur.value.start = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
	if (dayjs(localEnd.value).isBefore(dayjs(value))) localEnd.value = minuteur.value.start;
});

watch(localEnd, (value) => {
	minuteur.value.end = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
});

function setChapitreOrModule(value, type, chapitreOrModule) {
	if (type === 'chapitre') {
		minuteur.value.chapitre_id = value;
		minuteur.value.chapitre_name = chapitreOrModule.name;
		minuteur.value.module_id = chapitreOrModule.module_id;
	} else {
		minuteur.value.module_id = value;
		minuteur.value.chapitre_id = null;
		minuteur.value.chapitre_name = '';
	}
}

async function submit() {
	await toggleStartStopMinuteur(true, minuteur.value, true, true);
	show.value = false;
}
</script>

<template>
	<DialogModal closeable :show="show" @close="show = false">
		<template #title>
			<div class="flex space-x-2">
				<span>Saisie manuelle du minuteur</span>
			</div>
		</template>

		<template #content>
			<div class="sm:flex justify-between items-end space-y-2 sm:space-y-0 pt-4 sm:space-x-4">
				<div class="flex w-full items-center space-x-2 justify-between">
					<div class="flex-1 min-w-0">
						<TimeTrackerDropdown
							type="chapitre"
							:value="null"
							size="xlarge"
							class="bg-input-background"
							allow-reset
							with-modules
							:elements="chapitres"
							@change="setChapitreOrModule"
						></TimeTrackerDropdown>
					</div>
					<div class="flex items-center space-x-2">
						<div class="flex-col">
							<TagDropdown v-model="minuteur.taches" :taches="taches">
								<template #trigger>
									<Badge class="bg-input-background" tag="button" size="xlarge">
										<TagIcon v-if="minuteur.taches.length === 0" class="w-4"></TagIcon>
										<div
											v-else
											class="bg-accent-300/20 w-5 h-5 font-medium rounded flex items-center transition justify-center"
										>
											{{ minuteur.taches.length }}
										</div>
										<span>Tâches</span>
									</Badge>
								</template>
							</TagDropdown>
						</div>
					</div>
				</div>
			</div>
			<div class="flex pt-4 space-x-4">
				<div class="flex-1">
					<InputLabel>Durée</InputLabel>

					<div class="space-y-2 mt-1 flex flex-col">
						<DurationHumanInput v-model:start="localStart" v-model:end="localEnd"></DurationHumanInput>
						<div class="text-sm flex space-x-1">
							<InformationCircleIcon class="w-4 text-text-quaternary"></InformationCircleIcon>
							<span class="text-text-secondary text-xs">
								Vous pouvez taper en langage naturel ici, par ex.
								<span class="font-semibold"> 2h 30min</span>
							</span>
						</div>
					</div>
				</div>
				<div class="">
					<InputLabel>Début</InputLabel>
					<div class="flex flex-col items-center space-y-2 mt-1">
						<TimePickerSimple v-model="localStart" size="large"></TimePickerSimple>
						<DatePicker
							v-model="localStart"
							tabindex="1"
							class="text-xs text-text-tertiary max-w-28 px-1.5 py-1.5"
						></DatePicker>
					</div>
				</div>
				<div class="">
					<InputLabel>Fin</InputLabel>
					<div class="flex flex-col items-center space-y-2 mt-1">
						<TimePickerSimple v-model="localEnd" size="large"></TimePickerSimple>
						<DatePicker
							v-model="localEnd"
							tabindex="1"
							class="text-xs text-text-tertiary max-w-28 px-1.5 py-1.5"
						></DatePicker>
					</div>
				</div>
			</div>
		</template>
		<template #footer>
			<SecondaryButton tabindex="2" @click="show = false">Annuler</SecondaryButton>
			<PrimaryButton tabindex="2" class="ms-3" :class="{ 'opacity-25': loading }" :disabled="loading" @click="submit">
				Créer
			</PrimaryButton>
		</template>
	</DialogModal>
</template>

<style scoped></style>
