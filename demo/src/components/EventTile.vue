<script setup lang="ts">
import type { TimerEvent } from 'stackmat'
import { ref, onUnmounted } from 'vue'
import { useStackmat } from '@/composables/useStackmat'

const props = defineProps<{
    timerEvent: TimerEvent
}>()

const { stackmat } = useStackmat()
stackmat.on(props.timerEvent, () => {
    highlight()
})

const classes = ref('secondary')

function highlight() {
    classes.value = 'contrast'

    setTimeout(() => {
        classes.value = 'secondary'
    }, 1000)
}

onUnmounted(() => {
    stackmat.off(props.timerEvent)
})
</script>

<template>
    <button :class="classes">{{ timerEvent }}</button>
</template>

<style scoped>
button {
    cursor: default;
}
</style>
