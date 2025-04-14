<script setup>
import { twMerge } from 'tailwind-merge';
import Badge from '../Badge.vue';
import { TagIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
    name: String,
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
});

const indicatorClasses = {
    base: 'w-3 h-3',
    large: 'w-5 h-5',
};
</script>

<template>
    <Badge :name :size :tag :class="props.class" :color :border>
        <TagIcon :class="twMerge(indicatorClasses[size])"></TagIcon>
        <span v-if="name">
            {{ name }}
        </span>
    </Badge>
</template>

<style scoped></style>
