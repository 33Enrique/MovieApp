<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useMyShowsStore } from '@/stores/myShows'
import { useRouter } from 'vue-router'
import MediaCard from '@/components/MediaCard.vue'
import { batchSearchTheTVDBExact, type MediaItem, getShowDetails } from '@/services/thetvdbService'

const userId = '14' // Usuario real existente en la base de datos
const store = useMyShowsStore()
const router = useRouter()

const recommendedMovies = ref<MediaItem[]>([])
const popularSeries = ref<MediaItem[]>([])
const watchlistDetails = ref<MediaItem[]>([])
const showWatchlist = ref(false)

onMounted(async () => {
  await store.fetchLists(userId)
  recommendedMovies.value = await batchSearchTheTVDBExact([
    'Interstellar',
    'Joker',
    'Batman',
    'Mugen Train',
    'Ted',
    'Project X',
    'Spider Man',
    'Venom',
    'Rango',
    'Scarface',
    'World War Z',
    'Ted 2',
  ])
  popularSeries.value = await batchSearchTheTVDBExact([
    'Breaking Bad',
    'Blue Lock',
    'The Last of Us',
    'Hunter x Hunter',
    'You',
    'Solo leveling',
    'Wednesday',
    'Death Note',
    'Servant',
    'Cobra Kai',
    'Chernobyl',
    'Tokyo Ghoul',
  ])
})

watch(
  () => store.watchlist,
  async (ids) => {
    // Limpiar antes de cargar
    watchlistDetails.value = []
    for (const id of ids) {
      // Por defecto asumimos 'series', puedes mejorar esto si guardas el tipo
      const details = await getShowDetails(String(id), 'series')
      if (details) {
        watchlistDetails.value.push({
          id: details.id,
          title: details.name,
          rating: details.score ?? '7.9',
          imageSrc: details.image || '/images/placeholder.jpg',
          year: details.year || '',
          type: details.recordType || 'series',
        })
      }
    }
  },
  { immediate: true }
)
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
      <div class="list-item" @click="showWatchlist = !showWatchlist" style="cursor:pointer;">
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
    <div class="section-title">Recommended movies</div>
    <div class="shows-list cards">
      <MediaCard
        v-for="show in recommendedMovies"
        :key="show.id"
        :id="show.id"
        :title="show.title"
        :rating="show.rating"
        :imageSrc="show.imageSrc"
        :year="show.year"
        :type="show.type"
      />
    </div>
    <div class="section-title">Popular TV series</div>
    <div class="shows-list cards">
      <MediaCard
        v-for="show in popularSeries"
        :key="show.id"
        :id="show.id"
        :title="show.title"
        :rating="show.rating"
        :imageSrc="show.imageSrc"
        :year="show.year"
        :type="show.type"
      />
    </div>
    <div v-if="showWatchlist">
      <div class="section-title">My Watchlist</div>
      <div class="shows-list cards">
        <MediaCard
          v-for="show in watchlistDetails"
          :key="show.id"
          :id="show.id"
          :title="show.title"
          :rating="show.rating"
          :imageSrc="show.imageSrc"
          :year="show.year"
          :type="show.type"
        />
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