<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useChapitresStore } from '@/store/chapitres';
import { useTachesStore } from '@/store/taches';
import { useMinuteursStore } from '@/store/minuteurs';
import { getDayJsInstance, getLocalizedDayJs } from '@/Components/src/utils/time';
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

const props = defineProps({
	createTimeEntry: Function,
});

const { chapitres } = storeToRefs(useChapitresStore());
const { taches } = storeToRefs(useTachesStore());
const { setActiveState } = useMinuteursStore();

const timeEntryDefaultValues = {
	chapitre_id: null,
	module_id: null,
	taches: [],
	start: getDayJsInstance().utc().subtract(1, 'h').format(),
	end: getDayJsInstance().utc().format(),
};

const timeEntry = ref({ ...timeEntryDefaultValues });

const localStart = ref(getLocalizedDayJs(timeEntryDefaultValues.start).format());

const localEnd = ref(getLocalizedDayJs(timeEntryDefaultValues.end).format());

watch(localStart, (value) => {
	timeEntry.value.start = getLocalizedDayJs(value).utc().format();
	if (getLocalizedDayJs(localEnd.value).isBefore(getLocalizedDayJs(value))) {
		localEnd.value = value;
	}
});

watch(localEnd, (value) => {
	timeEntry.value.end = getLocalizedDayJs(value).utc().format();
});

async function submit() {
	await setActiveState(true, timeEntry.value, true);
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
							@change="(v, type) => (type === 'chapitre' ? (timeEntry.chapitre_id = v) : (timeEntry.module_id = v))"
						></TimeTrackerDropdown>
					</div>
					<div class="flex items-center space-x-2">
						<div class="flex-col">
							<TagDropdown v-model="timeEntry.taches" :tags="taches">
								<template #trigger>
									<Badge class="bg-input-background" tag="button" size="xlarge">
										<TagIcon v-if="timeEntry.taches.length === 0" class="w-4"></TagIcon>
										<div
											v-else
											class="bg-accent-300/20 w-5 h-5 font-medium rounded flex items-center transition justify-center"
										>
											{{ timeEntry.taches.length }}
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
