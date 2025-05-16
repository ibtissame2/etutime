<script setup>
import dayjs from 'dayjs';
import { ref } from 'vue';
import { CalendarIcon } from '@heroicons/vue/20/solid';
import Dropdown from '@/Components/src/Input/Dropdown.vue';
import DatePicker from '@/Components/src/Input/DatePicker.vue';
import { formatDateLocalized } from '@/Components/src/utils/time';

const start = defineModel('start', { default: '' });
const end = defineModel('end', { default: '' });
const open = ref(false);
const emit = defineEmits(['submit']);

function setToday() {
	start.value = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}

function setThisWeek() {
	start.value = dayjs().startOf('week').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().endOf('week').format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}
function setLastWeek() {
	start.value = dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}
function setLast14Days() {
	start.value = dayjs().subtract(14, 'days').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}
function setThisMonth() {
	start.value = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}
function setLastMonth() {
	start.value = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}
function setLast30Days() {
	start.value = dayjs().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}
function setLast90Days() {
	start.value = dayjs().subtract(90, 'days').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}
function setLast12Months() {
	start.value = dayjs().subtract(12, 'months').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}
function setThisYear() {
	start.value = dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}
function setLastYear() {
	start.value = dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD HH:mm:ss');
	end.value = dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD HH:mm:ss');
	emit('submit');
	open.value = false;
}
</script>

<template>
	<Dropdown v-model="open" :close-on-content-click="false" :align="'bottom-end'" @submit="emit('submit')">
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
