<script setup lang="ts">
    import IconGithub from './icons/IconGithub.vue'
    import IconNpm from './icons/IconNpm.vue'
</script>

<template>
    <nav>
        <ul>
            <li><strong>Stackmat Demo</strong></li>
        </ul>
        <ul>
            <li>
                <a href="https://www.npmjs.com/package/stackmat" target="_blank" rel="noopener noreferrer"><IconNpm /></a>
            </li>
            <li>
                <a href="https://github.com/stilesdev/stackmat" target="_blank" rel="noopener noreferrer"><IconGithub /></a>
            </li>
        </ul>
    </nav>
    <section>
        <p>
            Connect your timer to the microphone port on your computer and click the large blue
            button to start listening for events. Only tested with the SpeedStacks G4 timer, but the
            SpeedStacks G3 should also be compatible. Other timers may or may not work.
        </p>
        <p>Hover over each event for a short description of when it is fired.</p>
    </section>
</template>

<style scoped>
    li > strong {
        font-size: 1.5em;
    }

    p {
        font-size: 0.8em;
    }
</style>
