<script setup>
import { RouterView } from 'vue-router';
import Header from './components/Layout/Header.vue';
import Footer from './components/Layout/Footer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="container mx-auto flex-1 my-10">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
