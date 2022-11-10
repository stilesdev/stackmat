<script setup lang="ts">
import type { TimerEvent } from 'stackmat'
import { ref, onUnmounted } from 'vue'
import { useStackmat } from '@/composables/useStackmat'
import { computed } from 'vue'

const props = defineProps<{
    timerEvent: TimerEvent
}>()

const { stackmat } = useStackmat()
stackmat.on(props.timerEvent, () => {
    highlight()
})

const classes = ref('secondary')
let timer: number | undefined = undefined

const tooltip = computed(() => {
    switch (props.timerEvent) {
        case 'timerConnected':
            return 'Fired once when the Stackmat signal is detected'
        case 'timerDisconnected':
            return 'Fired once when the Stackmat signal is lost'
        case 'leftHandDown':
            return 'Fired when the left touch sensor is activated'
        case 'leftHandUp':
            return 'Fired when the left touch sensor is released'
        case 'rightHandDown':
            return 'Fired when the right touch sensor is activated'
        case 'rightHandUp':
            return 'Fired when the right touch sensor is released'
        case 'unready':
            return 'Fired when both hands are activated but at least one is released before starting event is fired'
        case 'ready':
            return 'Fired when both hands are activated'
        case 'starting':
            return 'Fired when both hands are activated and the solve is ready to start, a short time after the ready event was fired'
        case 'started':
            return 'Fired when the solve is started and the timer starts counting up'
        case 'stopped':
            return 'Fired when the solve is stopped with a completed time'
        case 'reset':
            return 'Fired when the timer is reset to zero'
        default:
            return ''
    }
})

function highlight() {
    classes.value = 'contrast'

    if (timer) {
        clearTimeout(timer)
    }

    timer = setTimeout(() => {
        classes.value = 'secondary'
    }, 200)
}

onUnmounted(() => {
    stackmat.off(props.timerEvent)
})
</script>

<template>
    <button :class="classes" :data-tooltip="tooltip">{{ timerEvent }}</button>
</template>

<style scoped>
button {
    cursor: default !important;
    font-size: smaller;
}
</style>
