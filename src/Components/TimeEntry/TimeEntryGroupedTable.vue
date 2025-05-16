<script setup>
import dayjs from 'dayjs';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useModulesStore } from '@/store/modules';
import { useChapitresStore } from '@/store/chapitres';
import { useTachesStore } from '@/store/taches';
import { useMinuteursStore } from '@/store/minuteurs';
import TimeEntryRowHeading from '@/Components/TimeEntry/TimeEntryRowHeading.vue';
import TimeEntryRow from '@/Components/TimeEntry/TimeEntryRow.vue';

const selectedMinuteurs = defineModel({ default: [] });

const { modules } = storeToRefs(useModulesStore());
const { chapitres } = storeToRefs(useChapitresStore());
const { taches } = storeToRefs(useTachesStore());
const { minuteurs, currentMinuteur } = storeToRefs(useMinuteursStore());
const { toggleStartStopMinuteur, createMinuteur, deleteMinuteurs } = useMinuteursStore();

const minuteursDayGroups = computed(() => {
	const groups = [];
	for (const minuteur of minuteurs.value) {
		const formatedDate = dayjs(minuteur.start).format('YYYY-MM-DD');
		let dayIndex = groups.findIndex((g) => g.date === formatedDate);
		if (dayIndex === -1) dayIndex = groups.push({ date: formatedDate, duration: 0, minuteurs: [] }) - 1;
		let index = groups[dayIndex].minuteurs.findIndex(
			(m) => m.module_id === minuteur.module_id && m.chapitre_id === minuteur.chapitre_id
		);
		if (index === -1) index = groups[dayIndex].minuteurs.push({ ...minuteur, duration: 0, sublist: [] }) - 1;
		groups[dayIndex].minuteurs[index].sublist.push(minuteur);
		if (dayjs(minuteur.start).isBefore(dayjs(groups[dayIndex].minuteurs[index].start)))
			groups[dayIndex].minuteurs[index].start = minuteur.start;
		if (dayjs(minuteur.end).isAfter(dayjs(groups[dayIndex].minuteurs[index].end)))
			groups[dayIndex].minuteurs[index].end = minuteur.end;
		groups[dayIndex].minuteurs[index].duration += minuteur.duration;
		groups[dayIndex].duration += minuteur.duration;
	}
	return groups;
});

async function startTimeEntryFromExisting(minuteur) {
	const alreadyRunning = currentMinuteur.value.id === minuteur.id;
	if (currentMinuteur.value.id) await toggleStartStopMinuteur(false, currentMinuteur.value);
	if (!alreadyRunning) await toggleStartStopMinuteur(true, { ...minuteur, id: undefined });
}
</script>

<template>
	<div v-for="dayGroupe in minuteursDayGroups" :key="dayGroupe.date">
		<TimeEntryRowHeading
			:date="dayGroupe.date"
			:duration="dayGroupe.duration"
			:selected="dayGroupe.minuteurs.every((a) => a.sublist.every((m) => selectedMinuteurs.includes(m)))"
			@select="dayGroupe.minuteurs.forEach((a) => selectedMinuteurs.push(...a.sublist))"
			@unselect="
				selectedMinuteurs = selectedMinuteurs.filter((m) => !dayGroupe.minuteurs.some((a) => a.sublist.includes(m)))
			"
		></TimeEntryRowHeading>
		<template v-for="aggregate in dayGroupe.minuteurs" :key="aggregate.module_id + '/' + aggregate.chapitre_id">
			<TimeEntryRow
				:expandable="aggregate.sublist.length > 1"
				:minuteur="aggregate.sublist[0]"
				:aggregate="aggregate"
				:selected="aggregate.sublist.every((m) => selectedMinuteurs.includes(m))"
				@selecte="selectedMinuteurs.push(...aggregate.sublist)"
				@unselecte="selectedMinuteurs = selectedMinuteurs.filter((m) => !aggregate.sublist.includes(m))"
				@start-stop-click="startTimeEntryFromExisting(aggregate.sublist[0])"
				@delete="deleteMinuteurs(aggregate.sublist)"
			>
				<TimeEntryRow
					v-for="subMinuteur in aggregate.sublist"
					:key="subMinuteur.id"
					:minuteur="subMinuteur"
					:aggregate="aggregate"
					:indent="true"
					:selected="selectedMinuteurs.includes(subMinuteur)"
					@selecte="selectedMinuteurs.push(subMinuteur)"
					@unselecte="selectedMinuteurs = selectedMinuteurs.filter((m) => m !== subMinuteur)"
					@start-stop-click="startTimeEntryFromExisting(subMinuteur)"
					@delete="deleteMinuteurs([subMinuteur])"
				></TimeEntryRow>
			</TimeEntryRow>
		</template>
	</div>
</template>
