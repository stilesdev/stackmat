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
                <EventTile timer-event="timerConnected" />
                <EventTile timer-event="timerDisconnected" />
            </div>
        </article>

        <article>
            <header>Hand Events</header>
            <div class="grid">
                <EventTile timer-event="leftHandDown" />
                <EventTile timer-event="leftHandUp" />
                <EventTile timer-event="rightHandDown" />
                <EventTile timer-event="rightHandUp" />
            </div>
        </article>

        <article>
            <header>Solve Events</header>
            <div class="grid">
                <EventTile timer-event="unready" />
                <EventTile timer-event="ready" />
                <EventTile timer-event="starting" />
                <EventTile timer-event="started" />
                <EventTile timer-event="stopped" />
                <EventTile timer-event="reset" />
            </div>
        </article>

        <footer>
            <ButtonTheme style="float: right;" />
        </footer>
    </main>
</template>
