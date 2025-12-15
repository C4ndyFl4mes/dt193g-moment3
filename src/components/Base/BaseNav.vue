<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import BaseButton from '../Base/BaseButton.vue';
const toggleText = ref(["Öppna meny", "Stäng meny"]);
let state = ref(false);
</script>

<template>
    <nav id="menu" :class="{ show: state, hide: !state }" class="relative w-50 max-w-[80vw] md:w-fit">
        <BaseButton :text="state ? toggleText[1] : toggleText[0]" @btn-click="state = !state"
            class="md:hidden w-full h-13 border-black p-2 bg-green-300 hover:brightness-95 active:brightness-90"
            :class="{ toggleBtnMenuOpen: state, toggleBtnMenuClose: !state }" />
        <div class="absolute md:relative w-[inherit] max-w-[inherit] md:border-2 md:rounded-2xl">
            <ul>
                <li>
                    <RouterLink active-class="underline font-bold" to="/">Start</RouterLink>
                </li>
                <li>
                    <RouterLink active-class="underline font-bold" to="/anime">Favorite Anime</RouterLink>
                </li>
                <li>
                    <RouterLink active-class="underline font-bold" to="/evaluation">Vue.js</RouterLink>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
@import "tailwindcss";

@layer base {
    ul {
        @apply flex flex-col md:flex-row;
    }

    li {
        @apply bg-green-200 md:bg-green-300 hover:brightness-95 active:brightness-90 md:first:rounded-l-2xl md:last:rounded-r-2xl;
    }

    li>a {
        @apply flex p-3 justify-center;
    }
}

@layer components {
    .show>div {
        @apply border-t-0 border-b-2 border-r-2 border-l-2 rounded-b-2xl overflow-hidden;
    }

    .toggleBtnMenuClose {
        @apply border-2 rounded-2xl;
    }

    .toggleBtnMenuOpen {
        @apply border-2 rounded-t-2xl;
    }

    .hide>div>ul {
        @apply hidden;
    }

    .hide>div>ul {
        @apply md:flex;
    }
}
</style>