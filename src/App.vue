<script setup>
  import { RouterView } from 'vue-router';
  import Header from './components/Layout/Header.vue';
  import Footer from './components/Layout/Footer.vue';
</script>

<template>
  <Header />
  <main class="container mx-auto">
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped></style>
