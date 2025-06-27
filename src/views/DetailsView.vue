<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getShowDetails } from '@/services/thetvdbService'
import { useMyShowsStore } from '@/stores/myShows'

const route = useRoute()
const rawId = route.params.id as string
const type = (route.params.type as 'series' | 'movie') || 'series'
const showId = rawId.replace(/^[^\d]*(\d+)$/, '$1')
console.log('DetallesView - rawId:', rawId, 'showId:', showId, 'type:', type)
const show = ref<any>(null)
const userId = 'user123'
const store = useMyShowsStore()

const loading = ref(true)

onMounted(async () => {
  loading.value = true
  console.log('Llamando getShowDetails con showId:', showId, 'type:', type)
  show.value = await getShowDetails(showId, type)
  console.log('Respuesta de getShowDetails:', show.value)
  await store.fetchLists(userId)
  loading.value = false
})

const inWatchlist = computed(() => store.watchlist.includes(showId))
const inWatched = computed(() => store.watched.includes(showId))
const inFavorites = computed(() => store.favorites.includes(showId))

const toggleList = async (status: string) => {
  if (status === 'watchlist') {
    if (inWatchlist.value) {
      await store.removeFromList(userId, showId, 'watchlist')
    } else {
      await store.addToList(userId, showId, 'watchlist')
    }
  } else if (status === 'watched') {
    if (inWatched.value) {
      await store.removeFromList(userId, showId, 'watched')
    } else {
      await store.addToList(userId, showId, 'watched')
    }
  } else if (status === 'favorites') {
    if (inFavorites.value) {
      await store.removeFromList(userId, showId, 'favorites')
    } else {
      await store.addToList(userId, showId, 'favorites')
    }
  }
}
</script>

<template>
  <div v-if="loading" class="details-container">
    <p>Cargando...</p>
  </div>
  <div v-else-if="show" class="details-container">
    <img :src="show.image_url || '/images/placeholder.jpg'" class="main-image" />
    <div class="header-info">
      <div class="subtitle">{{ show.status }} • {{ show.year || show.firstAired?.split('-')[0] || 'Año desconocido' }} • {{ show.runtime || '??' }} min</div>
      <h1>{{ show.name }}</h1>
      <div class="genres">
        <span v-for="genre in show.genres" :key="genre" class="tag">{{ genre }}</span>
      </div>
      <div class="imdb-rating" v-if="show.imdb_id">
        <span>IMDb</span>
        <span class="score">{{ show.siteRating || '8.0' }}</span>
      </div>
    </div>
    <p class="overview">{{ show.overview }}</p>
    <div class="creators" v-if="show.creators && show.creators.length">
      <span>Creators: <b>{{ show.creators.join(', ') }}</b></span>
    </div>
    <div class="actions-bar">
      <button :class="['action-btn', { active: inWatchlist }]" @click="toggleList('watchlist')">
        <span v-if="inWatchlist">✔</span>
        <span v-else>＋</span>
        Watchlist
      </button>
      <button :class="['action-btn', { active: inWatched }]" @click="toggleList('watched')">
        <span v-if="inWatched">✔</span>
        <span v-else>＋</span>
        Watched
      </button>
      <button :class="['action-btn', { active: inFavorites }]" @click="toggleList('favorites')">
        <span v-if="inFavorites">★</span>
        <span v-else>☆</span>
        Favorite
      </button>
    </div>
  </div>
</template>

<style scoped>
.details-container {
  padding: 20px;
  color: #fff;
  max-width: 500px;
  margin: 0 auto;
}
.main-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 20px;
}
.header-info {
  margin-bottom: 10px;
}
.subtitle {
  color: #a99cff;
  font-size: 14px;
  margin-bottom: 4px;
}
.genres {
  margin-bottom: 8px;
}
.tag {
  display: inline-block;
  margin: 3px 6px 3px 0;
  background: #444;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
}
.imdb-rating {
  background: #f5c518;
  color: #222;
  display: inline-block;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 8px;
}
.imdb-rating .score {
  margin-left: 6px;
}
.overview {
  margin: 18px 0 10px 0;
  font-size: 15px;
  color: #ccc;
}
.creators {
  margin-bottom: 18px;
  font-size: 14px;
  color: #a99cff;
}
.actions-bar {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: center;
}
.action-btn {
  background: #232336;
  border: 1.5px solid #5a4fcf;
  color: #fff;
  padding: 10px 18px;
  border-radius: 16px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s, color 0.2s;
}
.action-btn.active {
  background: #5a4fcf;
  color: #fff;
  border-color: #a99cff;
}
.action-btn span {
  font-size: 18px;
}
</style>
