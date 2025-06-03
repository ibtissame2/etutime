<script setup>
defineProps({
	name: String,
	order: Number,
	duration: String,
	working: Boolean,
	isCurrent: Boolean,
});
</script>

<template>
	<div class="pl-2 pr-4 py-2 2xl:py-3 border-card-background-separator flex items-center gap-2">
		<div v-if="order < 3" class="w-8 h-8 flex items-center justify-center">
			<img :src="`/images/medal-${order + 1}.png`" />
		</div>
		<div v-else class="border rounded-full border-card-background-separator w-8 h-8 text-center p-1">
			#{{ order + 1 }}
		</div>
		<div class="col-span-2 flex-1">
			<div class="flex justify-between">
				<p class="font-semibold text-sm text-text-primary">
					{{ isCurrent ? name + ' (Vous)' : name }}
				</p>
				<div v-if="working" class="flex space-x-1.5 items-center justify-end">
					<span class="relative flex h-3 w-3 justify-center items-center">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
					</span>
					<span class="text-green-500 font-medium text-sm block pb-0.5"> working </span>
				</div>
			</div>
			<div class="text-muted text-sm font-medium text-ellipsis whitespace-nowrap max-w-full overflow-hidden">
				{{ duration }}
			</div>
		</div>
	</div>
</template>

<style scoped>
img {
	height: 28px;
}
</style>
