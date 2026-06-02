<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />

  <main class="container-fluid p-0">
    <RouterView />
  </main>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-image: url('@/assets/purple_night_forest.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>