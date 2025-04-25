<script setup>
import { SecondaryButton } from '@/packages/ui/src';
import { ArrowDownTrayIcon, LockClosedIcon } from '@heroicons/vue/20/solid';
import Dropdown from '@/packages/ui/src/Input/Dropdown.vue';
import { ref } from 'vue';
import UpgradeModal from '@/Components/Common/UpgradeModal.vue';

const props = defineProps({
	download: {
		type: Function,
		required: true,
	},
});

const loading = ref(false);
const showPremiumModal = ref(false);

function triggerDownload(format) {
	loading.value = true;
	props.download(format).finally(() => {
		loading.value = false;
	});
}
</script>

<template>
	<Dropdown align="bottom-end">
		<template #trigger>
			<SecondaryButton :icon="ArrowDownTrayIcon" :loading> Export </SecondaryButton>
		</template>
		<template #content>
			<div class="flex flex-col space-y-1 p-1.5">
				<SecondaryButton class="border-0 px-2" @click="triggerDownload('pdf')">
					<div class="flex items-center space-x-2">
						<span> Export as PDF </span>
					</div>
				</SecondaryButton>
				<SecondaryButton class="border-0 px-2" @click="triggerDownload('xlsx')">Export as Excel</SecondaryButton>
				<SecondaryButton class="border-0 px-2" @click="triggerDownload('csv')">Export as CSV</SecondaryButton>
				<SecondaryButton class="border-0 px-2" @click="triggerDownload('ods')">Export as ODS </SecondaryButton>
			</div>
		</template>
	</Dropdown>
	<UpgradeModal v-model:show="showPremiumModal">
		<strong>PDF Reports</strong> are only available in solidtime Professional.
	</UpgradeModal>
</template>

<style scoped></style>
