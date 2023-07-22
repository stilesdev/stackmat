<script setup lang="ts">
    import { ref, onUnmounted } from 'vue'
    import { useStackmat } from '@/composables/useStackmat'

    const timerString = ref('0:00.000')

    const { stackmat } = useStackmat()
    stackmat.on('packetReceived', (packet) => {
        timerString.value = packet.timeAsString
    })

    onUnmounted(() => {
        stackmat.off('packetReceived')
    })
</script>

<template>
    <div class="grid">
        <div />
        <kbd>{{ timerString }}</kbd>
        <div />
    </div>
</template>

<style scoped>
    .grid {
        text-align: center;
        padding-top: 1em;
    }
</style>
