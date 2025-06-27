<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getShowDetails } from '@/services/thetvdbService'

const route = useRoute()
const showId = route.params.id as string
const show = ref<any>(null)

onMounted(async () => {
  show.value = await getShowDetails(showId)
})

const addToList = async (status: string) => {
  await fetch('http://localhost:3001/api/user-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user123',
      contentId: showId,
      status,
    }),
  })
}
</script>

<template>
  <div v-if="show" class="details-container">
    <img :src="show.image_url || '/images/placeholder.jpg'" class="main-image" />
    <h1>{{ show.name }}</h1>
    <p>{{ show.overview }}</p>

    <div class="genres">
      <span v-for="genre in show.genres" :key="genre" class="tag">{{ genre }}</span>
    </div>

    <div class="actions">
      <button @click="addToList('watchlist')">Watchlist</button>
      <button @click="addToList('watched')">Watched</button>
      <button @click="addToList('favorites')">Favorite</button>
    </div>
  </div>
</template>

<style scoped>
.details-container {
  padding: 20px;
  color: #fff;
}
.main-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
}
.tag {
  display: inline-block;
  margin: 5px;
  background: #444;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
}
.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.actions button {
  background: #5a4fcf;
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}
</style>
