<script setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import { watch, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePage } from '@/utils/inertia';
import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
import { useTachesStore } from '@/store/taches';
import { useMinuteursStore } from '@/store/minuteurs';
import { ClockIcon } from '@heroicons/vue/20/solid';
import { autoUpdate, flip, limitShift, offset, shift, useFloating } from '@floating-ui/vue';
import CardTitle from '@/Components/src/CardTitle.vue';
import TimeTrackerTagDropdown from '@/Components/TimeTracker/TimeTrackerTagDropdown.vue';
import TimeTrackerStartStop from '@/Components/TimeTracker/TimeTrackerStartStop.vue';
import TimeTrackerRangeSelector from '@/Components/TimeTracker/TimeTrackerRangeSelector.vue';
import TimeTrackerDropdown from '@/Components/TimeTracker/TimeTrackerDropdown.vue';
import TimeTrackerRecentlyTrackedEntry from '@/Components/TimeTracker/TimeTrackerRecentlyTrackedEntry.vue';

const emit = defineEmits(['change']);

const { modules } = storeToRefs(useModulesStore());
const { chapitres } = storeToRefs(useChapitresStore());
const { taches } = storeToRefs(useTachesStore());
const { minuteurs, currentMinuteur } = storeToRefs(useMinuteursStore());
const { toggleStartStopMinuteur } = useMinuteursStore();

const page = usePage();
dayjs.extend(duration);
dayjs.extend(utc);

const tempChapitreName = ref(currentMinuteur.value?.chapitre_name || '');
const showDropdown = ref(false);
const floating = ref(null);
const currentChapitreNameInput = ref(null);

const noDuplicatedChapitres = computed(() => {
	const search = tempChapitreName.value?.toLowerCase()?.trim() || '';
	const noDuplicates = [];
	const areEnded = minuteurs.value.filter((item) => item.end);
	for (let index = 0; index < areEnded.length; index++) {
		if (!areEnded[index].chapitre_id) continue;
		if (search && !areEnded[index].chapitre_name?.toLowerCase().includes(search)) continue;
		if (noDuplicates.some((it) => it.id === areEnded[index].chapitre_id)) continue;
		const chapitre = { ...areEnded[index], id: areEnded[index].chapitre_id, name: areEnded[index].chapitre_name };
		noDuplicates.push(chapitre);
		if (noDuplicates.length > 10) break;
	}
	for (let index = 0; index < chapitres.value.length; index++) {
		if (noDuplicates.length > 10) break;
		if (search && !chapitres.value[index].name?.toLowerCase().includes(search)) continue;
		if (noDuplicates.some((it) => it.id === chapitres.value[index].id)) continue;
		noDuplicates.push(chapitres.value[index]);
	}
	return noDuplicates;
});

const { floatingStyles } = useFloating(currentChapitreNameInput, floating, {
	placement: 'bottom-start',
	whileElementsMounted: autoUpdate,
	middleware: [offset(10), shift({ limiter: limitShift({ offset: 5 }) }), flip({ fallbackAxisSideDirection: 'start' })],
});

const extractData = (timer) => {
	return {
		...timer,
		chapitre_name: timer?.name || timer?.chapitre_name || '',
		chapitre_id: timer?.chapitre_id || timer?.id || null,
		module_id: timer?.chapitre_module_id || timer?.module_id || null,
		taches: timer?.taches ? [...timer.taches] : [],
		start: '',
	};
};

function setDataOf(element) {
	currentMinuteur.value = extractData(element || null);
}

function updateChapitreName() {
	showDropdown.value = false;
	if (currentMinuteur.value.chapitre_name === tempChapitreName.value) return;
	currentMinuteur.value.chapitre_name = tempChapitreName.value;
}

watch(
	() => currentMinuteur.value?.chapitre_name,
	() => (tempChapitreName.value = currentMinuteur.value?.chapitre_name || '')
);
</script>

<template>
	<CardTitle title="Suivi du temps" :icon="ClockIcon"></CardTitle>
	<div class="relative">
		<div class="flex items-center relative @container" data-testid="dashboard_timer">
			<div
				class="flex flex-col @2xl:flex-row w-full justify-between rounded-lg bg-card-background border-card-border border transition shadow-card"
			>
				<div class="flex flex-1 items-center pr-6 relative">
					<input
						ref="currentChapitreNameInput"
						v-model="tempChapitreName"
						placeholder="Sur quoi travaillez-vous ?"
						data-testid="time_entry_description"
						class="w-full rounded-l-lg py-4 sm:py-2.5 px-3.5 border-b border-b-card-background-separator @2xl:px-4 text-base @4xl:text-lg text-text-primary font-medium bg-transparent border-none placeholder-muted focus:ring-0 transition"
						type="text"
						@keydown.esc="showDropdown = false"
						@focus="showDropdown = true"
						@blur="updateChapitreName"
					/>
					<div
						v-if="showDropdown && noDuplicatedChapitres.length > 0"
						ref="floating"
						class="z-50 w-full max-w-2xl"
						:style="floatingStyles"
					>
						<div
							class="rounded-lg w-full fixed min-w-xl top-0 left-0 border border-card-border overflow-none shadow-dropdown bg-card-background"
						>
							<div class="text-text-secondary py-1 px-1.5">
								<TimeTrackerRecentlyTrackedEntry
									v-for="chapitreOrTimer in noDuplicatedChapitres"
									:key="chapitreOrTimer.id"
									:chapitre="chapitreOrTimer"
									:highlighted="false"
									@mousedown="setDataOf({ ...chapitreOrTimer, id: undefined })"
								></TimeTrackerRecentlyTrackedEntry>
							</div>
						</div>
					</div>
				</div>
				<div class="flex items-center justify-between pl-2 shrink min-w-0">
					<div class="flex items-center w-[130px] @2xl:w-auto shrink min-w-0">
						<TimeTrackerDropdown
							type="module"
							allow-reset
							:value="currentMinuteur.module_id"
							:elements="modules"
							@change="(v) => (currentMinuteur.module_id = v)"
						></TimeTrackerDropdown>
					</div>
					<div class="flex items-center @2xl:space-x-2 px-2 @2xl:px-4">
						<TimeTrackerTagDropdown v-model="currentMinuteur.taches" :tags="taches"></TimeTrackerTagDropdown>
					</div>
					<div class="border-l border-card-border">
						<TimeTrackerRangeSelector
							v-model="currentMinuteur"
							@create-timer="() => toggleStartStopMinuteur(true, currentMinuteur)"
						></TimeTrackerRangeSelector>
					</div>
				</div>
			</div>

			<div class="pl-4 @2xl:pl-6 pr-3 absolute sm:relative top-[6px] sm:top-0 right-0">
				<TimeTrackerStartStop
					:active="!!currentMinuteur?.start"
					size="large"
					@changed="(s) => toggleStartStopMinuteur(s, currentMinuteur)"
				></TimeTrackerStartStop>
			</div>
		</div>
	</div>
</template>
