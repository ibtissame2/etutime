<template>
  <section class="flex flex-col">
    <!-- <CardTitle :title="title" :icon="icon"></CardTitle> -->
    <div
      class="rounded-lg bg-card-background border border-card-border flex-1 flex items-stretch shadow-card"
    >
      <div class="w-full flex flex-col">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup>
// Ibtissame
// import CardTitle from "@/packages/ui/src/CardTitle.vue";

defineProps({
  title: String,
  icon: { type: Object, required: false },
});
</script>
