<script setup lang="ts">
import '@picocss/pico'
import TheHeader from './components/TheHeader.vue'
import ButtonTheme from './components/ButtonTheme.vue'
</script>

<template>
    <main class="container">
        <TheHeader />

        <footer>
            <ButtonTheme style="float: right" />
        </footer>
    </main>
</template>

<style>
@import './assets/base.css';
</style>
