<script setup>
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';

const props = defineProps(
    size: {
        type: String,
        default: 'base',
    },
    tag: {
        type: String,
        default: 'div',
    },
    class: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        default: 'var(--theme-color-icon-default)',
    },
    border: {
        type: Boolean,
        default: true,
    },
);

const badgeClasses = {
    base: 'py-1 px-2 space-x-1.5 text-xs',
    large: 'py-1 sm:py-1.5 px-2 sm:px-3 space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-muted',
    xlarge: 'py-2 sm:py-2.5 px-3 sm:px-3.5 space-x-2 sm:space-x-3 text-sm sm:text-sm text-muted',
};

const borderClasses = computed(() => {
    if (props.border) {
        return 'border-input-border border';
    }
    return '';
});

const tagClasses = computed(() => {
    if (props.tag === 'button') {
        return 'hover:bg-tertiary';
    }
    return '';
});
</script>

<template>
    <component
        :is="tag"
        :class="
            twMerge(
                tagClasses,
                badgeClasses[size],
                borderClasses,
                'rounded transition inline-flex items-center font-semibold text-text-primary disabled:text-text-quaternary outline-0  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                props.class
            )
        ">
        <slot></slot>
    </component>
</template>

<style scoped></style>
