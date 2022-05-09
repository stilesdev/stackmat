<script setup lang="ts">
import { useStackmat } from '@/composables/useStackmat'
import { computed } from 'vue'

const { start, stop, isListening } = useStackmat()

const buttonText = computed(() => (isListening.value ? 'Stop' : 'Start'))
const buttonClass = computed(() => (isListening.value ? 'contrast' : 'primary'))

function toggleListening() {
    if (isListening.value) {
        stop()
    } else {
        start()
    }
}
</script>

<template>
    <button :class="buttonClass" @click="toggleListening">
        {{ buttonText }} Listening for Events
    </button>
</template>
