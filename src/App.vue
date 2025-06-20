<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNav from './components/BottomNav.vue'

const handleNavChange = (itemId: string) => {
  console.log('Navegación cambiada a:', itemId)
}
</script>

<template>
  <div id="app">
    <main class="main-content">
      <RouterView />
    </main>
    <BottomNav @nav-change="handleNavChange" />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  background-color: #232336;
}

/* Estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #fff;
  background-color: #232336;
}
</style>