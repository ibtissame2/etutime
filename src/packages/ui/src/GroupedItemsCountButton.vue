<script setup>
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';

const props =  defineProps({
    expanded: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: 'w-7 h-7'
    },
})

const expandedStatusClasses = computed(() => {
    if (props.expanded) {
        return 'border-card-border border bg-card-background-active text-text-primary';
    }
    return 'border-card-border border bg-card-background hover:bg-card-background-active hover:text-text-primary transition text-muted';
});
</script>

<template>
    <button
        :class="
            twMerge(
                'font-medium rounded flex items-center transition justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
                expandedStatusClasses,
                props.size
            )
        ">
        <slot></slot>
    </button>
</template>

<style scoped></style>
