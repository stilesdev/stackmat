<script setup lang="ts">
import '@picocss/pico'
import TheHeader from './components/TheHeader.vue'
import ButtonTheme from './components/ButtonTheme.vue'
import ButtonStartStop from './components/ButtonStartStop.vue'
import TimerTile from './components/TimerTile.vue'
import EventTile from './components/EventTile.vue'
</script>

<template>
    <main class="container">
        <TheHeader />

        <ButtonStartStop />

        <TimerTile />

        <article>
            <header>Timer Events</header>
            <div class="grid">
                <EventTile timerEvent="timerConnected" />
                <EventTile timerEvent="timerDisconnected" />
            </div>
        </article>

        <article>
            <header>Hand Events</header>
            <div class="grid">
                <EventTile timerEvent="leftHandDown" />
                <EventTile timerEvent="leftHandUp" />
                <EventTile timerEvent="rightHandDown" />
                <EventTile timerEvent="rightHandUp" />
            </div>
        </article>

        <article>
            <header>Solve Events</header>
            <div class="grid">
                <EventTile timerEvent="unready" />
                <EventTile timerEvent="ready" />
                <EventTile timerEvent="starting" />
                <EventTile timerEvent="started" />
                <EventTile timerEvent="stopped" />
                <EventTile timerEvent="reset" />
            </div>
        </article>

        <footer>
            <ButtonTheme style="float: right" />
        </footer>
    </main>
</template>

<style>
@import './assets/base.css';
</style>
