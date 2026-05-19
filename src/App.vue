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

</style>