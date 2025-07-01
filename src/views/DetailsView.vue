<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getShowDetails } from '@/services/thetvdbService'
import { useMyShowsStore } from '@/stores/myShows'

const route = useRoute()
const router = useRouter()
const rawId = route.params.id as string
const [typePrefix, idStr] = rawId.split('-')
const type = typePrefix === 'movie' ? 'movie' : 'series'
const showId = idStr

const show = ref<any>(null)
const userId = 14
const store = useMyShowsStore()
const loading = ref(true)

const animatingStatus = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  show.value = await getShowDetails(String(showId), type)
  await store.fetchLists(String(userId))
  loading.value = false
})

const inWatchlist = computed(() => store.watchlist.includes(showId))
const inWatched = computed(() => store.watched.includes(showId))
const inFavorites = computed(() => store.favorites.includes(showId))

const toggleList = async (status: string) => {
  if (status === 'watchlist') {
    inWatchlist.value
      ? await store.removeFromList(String(userId), String(showId), 'watchlist')
      : await store.addToList(String(userId), String(showId), 'watchlist')
  } else if (status === 'watched') {
    inWatched.value
      ? await store.removeFromList(String(userId), String(showId), 'watched')
      : await store.addToList(String(userId), String(showId), 'watched')
  } else if (status === 'favorites') {
    inFavorites.value
      ? await store.removeFromList(String(userId), String(showId), 'favorites')
      : await store.addToList(String(userId), String(showId), 'favorites')
  }

  animatingStatus.value = status
  setTimeout(() => {
    animatingStatus.value = null
  }, 600)
}

const goToWatch = () => {
  router.push(`/watch/${type}-${showId}`)
}
</script>

<template>
  <div v-if="loading" class="details-container">
    <p>Cargando...</p>
  </div>
  <div v-else-if="show" class="details-container">
    <img :src="show.image_url || '/images/placeholder.jpg'" class="main-image" />
    <div class="header-info">
      <div class="subtitle">{{ show.status }} • {{ show.year }} • {{ show.runtime }} min</div>
      <h1>{{ show.name }}</h1>
      <div class="genres">
        <span v-for="genre in show.genres" :key="genre" class="tag">{{ genre }}</span>
      </div>
      <div class="imdb-rating">
        <span>IMDb</span>
        <span class="score">{{ show.siteRating }}</span>
      </div>
    </div>
    <p class="overview">{{ show.overview }}</p>
    <div class="creators" v-if="show.creators.length">
      <span
        >Creators: <b>{{ show.creators.join(', ') }}</b></span
      >
    </div>
    <button class="start-btn" @click="goToWatch">Start watching</button>
    <div class="actions-bar">
      <button
        :class="['action-btn', { active: inWatchlist, animate: animatingStatus === 'watchlist' }]"
        @click="toggleList('watchlist')"
      >
        <span v-if="inWatchlist">✔</span>
        <span v-else>＋</span>
        Watchlist
      </button>
      <button
        :class="['action-btn', { active: inWatched, animate: animatingStatus === 'watched' }]"
        @click="toggleList('watched')"
      >
        <span v-if="inWatched">✔</span>
        <span v-else>＋</span>
        Watched
      </button>
      <button
        :class="['action-btn', { active: inFavorites, animate: animatingStatus === 'favorites' }]"
        @click="toggleList('favorites')"
      >
        <span v-if="inFavorites">★</span>
        <span v-else>☆</span>
        Favorites
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
  padding-bottom: 100px;
}

.main-image {
  width: 100%;
  max-height: 650px;
  object-fit: cover;
  object-position: center;
  border-radius: 20px;
  margin-bottom: 20px;
}

.header-info {
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  color: #a99cff;
  font-size: 13px;
  margin-bottom: 4px;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px 0;
  gap: 6px;
}

.tag {
  background: #444;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
}

.imdb-rating {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f5c518;
  color: #222;
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 13px;
  font-weight: bold;
  margin: 8px auto;
}

.overview {
  margin: 18px 0 10px 0;
  font-size: 14px;
  color: #ccc;
  text-align: center;
}

.creators {
  margin-bottom: 18px;
  font-size: 13px;
  color: #a99cff;
  text-align: center;
}

.start-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: #5a4fcf;
  color: #fff;
  padding: 12px;
  border-radius: 25px;
  margin: 15px 0;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  gap: 8px;
}

.actions-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  background: #232336;
  border: none;
  color: #fff;
  padding: 10px 12px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  flex-direction: column;
  display: flex;
  align-items: center;
  width: 90px;
  gap: 4px;
  transition:
    background 0.2s,
    transform 0.2s;
}

.action-btn.active {
  background: #5a4fcf;
  color: #fff;
}

.action-btn.animate {
  animation: pulse 0.2s;
}

.action-btn span {
  font-size: 18px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 600px) {
  .actions-bar {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  .action-btn {
    flex: 0 0 auto;
  }
}
</style>
