import { readonly, ref } from 'vue'

const theme = ref('light')
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark'
}

function setTheme(newTheme: string) {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', newTheme)
    theme.value = newTheme
}

function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
}

export function useTheme() {
    return {
        theme: readonly(theme),
        toggleTheme,
    }
}
