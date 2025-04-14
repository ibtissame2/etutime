<script setup>
defineProps({
    href: [String, undefined],
    as: [String, undefined],
});
</script>

<template>
    <div>
        <button
            v-if="as == 'button'"
            type="submit"
            v-bind="$attrs"
            class="block w-full px-4 py-2 text-start text-sm leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out">
            <slot />
        </button>
        <a
            v-else-if="as == 'a'"
            :href="href"
            class="block px-4 py-2 text-sm leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out">
            <slot />
        </a>

        <router-link
            v-else
            :href="href ?? ''"
            class="block px-4 py-2 text-sm leading-5 text-text-primary hover:bg-card-background-active focus:outline-none focus:bg-card-background-active transition duration-150 ease-in-out">
            <slot />
        </router-link>
    </div>
</template>
