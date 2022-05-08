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
                <a href="https://www.npmjs.com/package/stackmat" target="_blank"><IconNpm /></a>
            </li>
            <li>
                <a href="https://github.com/stilesdev/stackmat" target="_blank"><IconGithub /></a>
            </li>
        </ul>
    </nav>
    <section>
        <p>Description here</p>
    </section>
</template>
