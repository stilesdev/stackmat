<script setup lang="ts">
    import { useTheme } from '@/composables/useTheme'
    import IconSun from './icons/IconSun.vue'
    import IconMoon from './icons/IconMoon.vue'

    const { theme, toggleTheme } = useTheme()
</script>

<template>
    <a style="cursor: pointer;" @click="toggleTheme">
        <IconSun v-if="theme === 'light'" />
        <IconMoon v-else />
    </a>
</template>
