import { Stackmat } from 'stackmat'
import { readonly, ref } from 'vue'

const stackmat = new Stackmat()
const isListening = ref(false)

function start() {
    isListening.value = true
    stackmat.start()
}

function stop() {
    isListening.value = false
    stackmat.stop()
}

export function useStackmat() {
    return {
        stackmat,
        start,
        stop,
        isListening: readonly(isListening),
    }
}
