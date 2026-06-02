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
  background: radial-gradient(circle at 50% 50%, #0f0a1c 0%, #07050e 100%);
  background-attachment: fixed;
  min-height: 100vh;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #ffffff;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

/* Custom Cyberpunk Scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #07050e;
}
::-webkit-scrollbar-thumb {
  background: #a855f7;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
}
::-webkit-scrollbar-thumb:hover {
  background: #d946ef;
}
</style>