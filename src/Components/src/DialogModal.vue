<script setup>
import Modal from './Modal.vue';

const emit = defineEmits(['close']);

defineProps({
	show: { type: Boolean, default: false },
	maxWidth: { type: String, default: '2xl' },
	closeable: { type: Boolean, default: true },
});
</script>

<template>
	<Modal :show="show" :max-width="maxWidth" :closeable="closeable" @close="emit('close')">
		<div class="px-6 py-4">
			<div class="text-lg font-medium text-text-primary" role="heading">
				<slot name="title" />
			</div>

			<div class="mt-4 text-sm text-muted">
				<slot name="content" />
			</div>
		</div>

		<div
			class="flex flex-row justify-end px-6 py-4 border-t border-card-background-separator bg-default-background rounded-b-2xl text-end"
		>
			<slot name="footer" />
		</div>
	</Modal>
</template>
