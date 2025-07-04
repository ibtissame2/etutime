<script setup>
import { computed, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { useId } from 'radix-vue';
import { isLastLayer, layers } from '@/Components/src/utils/dismissableLayer';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import { ref } from 'vue';

const emit = defineEmits(['close']);

const props = defineProps({
	show: { type: Boolean, default: false },
	maxWidth: { type: String, default: '2xl' },
	closeable: { type: Boolean, default: true },
});

const id = useId();

const maxWidthClass = computed(() => {
	return {
		sm: 'sm:max-w-sm',
		md: 'sm:max-w-md',
		lg: 'sm:max-w-lg',
		xl: 'sm:max-w-xl',
		'2xl': 'sm:max-w-2xl',
	}[props.maxWidth];
});

const target = ref();

const { activate, deactivate } = useFocusTrap(target, { allowOutsideClick: true });

const close = () => props.closeable && emit('close');

const closeOnEscape = (e) => isLastLayer(id) && e.key === 'Escape' && props.show && close();

onMounted(() => {
	document.addEventListener('keydown', closeOnEscape);
});

onUnmounted(() => {
	document.removeEventListener('keydown', closeOnEscape);
	document.body.style.overflow = 'visible';
});

watch(
	() => props.show,
	(value) => {
		document.body.style.overflow = props.show ? 'hidden' : 'visible';
		if (value) layers.value.push(id);
		else layers.value = layers.value.filter((layer) => layer !== id);
		nextTick(() => (value ? activate() : deactivate()));
	}
);
</script>

<template>
	<teleport to="body">
		<transition leave-active-class="duration-200">
			<div v-show="show" class="fixed inset-0 overflow-y-auto px-4 py-32 sm:px-0 z-50" scroll-region>
				<transition
					enter-active-class="ease-out duration-300"
					enter-from-class="opacity-0"
					enter-to-class="opacity-100"
					leave-active-class="ease-in duration-200"
					leave-from-class="opacity-100"
					leave-to-class="opacity-0"
				>
					<div v-show="show" class="fixed inset-0 transform transition-all backdrop-blur-sm" @click="close">
						<div class="absolute inset-0 bg-default-background opacity-30" />
					</div>
				</transition>

				<transition
					enter-active-class="ease-out duration-300"
					enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					enter-to-class="opacity-100 translate-y-0 sm:scale-100"
					leave-active-class="ease-in duration-200"
					leave-from-class="opacity-100 translate-y-0 sm:scale-100"
					leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
				>
					<div
						v-show="show"
						ref="target"
						role="dialog"
						class="mb-6 bg-default-background border border-card-border rounded-lg shadow-xl transform transition-all sm:w-full sm:mx-auto"
						:class="maxWidthClass"
					>
						<slot v-if="show" />
					</div>
				</transition>
			</div>
		</transition>
	</teleport>
</template>
