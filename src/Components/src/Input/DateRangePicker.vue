<script setup>
import { CalendarIcon } from '@heroicons/vue/20/solid';
import Dropdown from '@/Components/src/Input/Dropdown.vue';
import DatePicker from '@/Components/src/Input/DatePicker.vue';
import { formatDateLocalized, getDayJsInstance, getLocalizedDayJs } from '@/Components/src/utils/time';
import { ref } from 'vue';

const start = defineModel('start', { default: '' });
const end = defineModel('end', { default: '' });
const open = ref(false);
const emit = defineEmits(['submit']);

function setToday() {
	start.value = getLocalizedDayJs().startOf('day').format();
	end.value = getLocalizedDayJs().endOf('day').format();
	emit('submit');
	open.value = false;
}

function setThisWeek() {
	start.value = getLocalizedDayJs().startOf('week').format();
	end.value = getLocalizedDayJs().endOf('week').format();
	emit('submit');
	open.value = false;
}
function setLastWeek() {
	start.value = getLocalizedDayJs().subtract(1, 'week').startOf('week').format();
	end.value = getLocalizedDayJs().subtract(1, 'week').endOf('week').format();
	emit('submit');
	open.value = false;
}
function setLast14Days() {
	start.value = getLocalizedDayJs().subtract(14, 'days').format();
	end.value = getLocalizedDayJs().format();
	emit('submit');
	open.value = false;
}
function setThisMonth() {
	start.value = getLocalizedDayJs().startOf('month').format();
	end.value = getLocalizedDayJs().endOf('month').format();
	emit('submit');
	open.value = false;
}
function setLastMonth() {
	start.value = getLocalizedDayJs().subtract(1, 'month').startOf('month').format();
	end.value = getLocalizedDayJs().subtract(1, 'month').endOf('month').format();
	emit('submit');
	open.value = false;
}
function setLast30Days() {
	start.value = getLocalizedDayJs().subtract(30, 'days').format();
	end.value = getLocalizedDayJs().format();
	emit('submit');
	open.value = false;
}
function setLast90Days() {
	start.value = getDayJsInstance()().subtract(90, 'days').format();
	end.value = getDayJsInstance()().format();
	emit('submit');
	open.value = false;
}
function setLast12Months() {
	start.value = getLocalizedDayJs().subtract(12, 'months').format();
	end.value = getLocalizedDayJs().format();
	emit('submit');
	open.value = false;
}
function setThisYear() {
	start.value = getLocalizedDayJs().startOf('year').format();
	end.value = getLocalizedDayJs().endOf('year').format();
	emit('submit');
	open.value = false;
}
function setLastYear() {
	start.value = getLocalizedDayJs().subtract(1, 'year').startOf('year').format();
	end.value = getLocalizedDayJs().subtract(1, 'year').endOf('year').format();
	emit('submit');
	open.value = false;
}
</script>

<template>
	<Dropdown v-model="open" :close-on-content-click="false" align="bottom-end" @submit="emit('submit')">
		<template #trigger>
			<button
				class="px-2 py-1 bg-input-background border border-input-border font-medium rounded-lg flex items-center space-x-2"
			>
				<CalendarIcon class="w-5" />
				<div class="text-text-primary">
					{{ formatDateLocalized(start) }}
					<span class="px-1.5 text-muted">-</span>
					{{ formatDateLocalized(end) }}
				</div>
			</button>
		</template>

		<template #content>
			<div class="overflow-hidden w-[430px] px-3 py-1.5">
				<div class="flex divide-x divide-border-secondary justify-between">
					<div
						class="text-text-primary text-sm flex flex-col space-y-0.5 items-start py-2 [&_button:hover]:bg-tertiary [&_button]:rounded [&_button]:px-2 [&_button]:py-1"
					>
						<button @click="setToday">Aujourd’hui</button>
						<button @click="setThisWeek">Cette semaine</button>
						<button @click="setLastWeek">Semaine dernière</button>
						<button @click="setLast14Days">Les 14 derniers jours</button>
						<button @click="setThisMonth">Ce mois-ci</button>
						<button @click="setLastMonth">Mois dernier</button>
						<button @click="setLast30Days">Les 30 derniers jours</button>
						<button @click="setLast90Days">Les 90 derniers jours</button>
						<button @click="setLast12Months">Les 12 derniers mois</button>
						<button @click="setThisYear">Cette année</button>
						<button @click="setLastYear">Année dernière</button>
					</div>

					<div class="pl-5">
						<div class="space-y-1 flex-col flex items-start">
							<div class="text-xs font-semibold text-muted">Date de début</div>
							<DatePicker v-model="start" />
						</div>
						<div class="mt-2 space-y-1 flex-col flex items-start">
							<div class="text-sm font-medium text-muted">Date de fin</div>
							<DatePicker v-model="end" />
						</div>
					</div>
				</div>
			</div>
		</template>
	</Dropdown>
</template>
