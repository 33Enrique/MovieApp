<script setup lang="ts">
import { onMounted } from 'vue'
import { useMyShowsStore } from '@/stores/myShows'
import { useRouter } from 'vue-router'

const userId = 'user123' // Simulación de usuario
const store = useMyShowsStore()
const router = useRouter()

onMounted(() => {
  store.fetchLists(userId)
})
</script>

<template>
  <div class="myshows-container">
    <div class="search-bar">
      <input type="text" placeholder="Search shows" />
    </div>
    <div class="tabs">
      <button class="active">TV series</button>
      <button>Movies</button>
    </div>
    <div class="lists-summary">
      <div class="list-item">
        <span>Watchlist</span>
        <span class="count">{{ store.watchlist.length }}</span>
      </div>
      <div class="list-item">
        <span>Watched</span>
        <span class="count">{{ store.watched.length }}</span>
      </div>
      <div class="list-item">
        <span>Favorites</span>
        <span class="count">{{ store.favorites.length }}</span>
      </div>
    </div>
    <div class="section-title">Watchlist</div>
    <div class="shows-list">
      <div v-if="store.loading">Loading...</div>
      <div v-else-if="store.watchlist.length === 0">No shows in watchlist.</div>
      <div v-else class="cards">
        <div v-for="id in store.watchlist" :key="id" class="show-card">
          <!-- Aquí luego se puede mostrar más info del show -->
          <span>{{ id }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.myshows-container {
  padding: 20px;
  color: #fff;
}
.search-bar {
  margin-bottom: 16px;
}
.search-bar input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #232336;
  color: #fff;
  font-size: 16px;
  outline: none;
  border: 1px solid #5a4fcf;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.tabs button {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  background: #232336;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
.tabs .active {
  background: #5a4fcf;
  color: #fff;
}
.lists-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.list-item {
  background: #2c2c44;
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.count {
  font-size: 18px;
  font-weight: bold;
  color: #a99cff;
}
.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}
.shows-list .cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.show-card {
  background: #232336;
  border-radius: 8px;
  padding: 20px;
  min-width: 120px;
  text-align: center;
  color: #fff;
}
</style> 