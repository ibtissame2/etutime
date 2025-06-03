<script setup>
import { ref } from 'vue';

defineProps({
	title: String,
	type: String,
	message: [String, undefined],
});

const show = ref(true);
</script>

<template>
	<transition
		enter-active-class="transform ease-out duration-300 transition"
		enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
		enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
		leave-active-class="transition ease-in duration-100"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
	>
		<div
			v-if="show"
			class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border border-card-border bg-card-background shadow-lg ring-1 ring-black text-text-primary ring-opacity-5"
		>
			<div class="p-4" style="color: var(--text-primary); background-color: var(--bg-secondary)">
				<div class="flex items-start">
					<div class="flex-shrink-0"></div>
					<div class="ml-3 w-0 flex-1 pt-0.5">
						<p class="text-sm font-medium text-text-primary">
							{{ title }}
						</p>
						<p v-if="message" class="mt-1 text-sm text-muted">
							{{ message }}
						</p>
					</div>
					<div class="ml-4 flex flex-shrink-0">
						<button
							type="button"
							class="inline-flex rounded-md bg-card-background text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							@click="show = false"
						>
							<span class="sr-only">Close</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
