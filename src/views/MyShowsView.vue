<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import MediaSection from '../components/MediaSection.vue'
import { useMyShowsStore } from '@/stores/myShows'
import { batchSearchTheTVDBExact, getShowDetails, type MediaItem } from '@/services/thetvdbService'
import { useSearch } from '../composables/useSearch'

const userId = '14'
const store = useMyShowsStore()

const watchlistDetails = ref<MediaItem[]>([])
const watchedDetails = ref<MediaItem[]>([])
const favoritesDetails = ref<MediaItem[]>([])

const { searchQuery, searchResults, isLoading, search } = useSearch()

const handleSearch = (query: string) => {
  search(query)
}

onMounted(async () => {
  await store.fetchLists(userId)

  // Limpiar arrays antes de llenar
  watchlistDetails.value = []
  watchedDetails.value = []
  favoritesDetails.value = []

  // Watchlist

  const idsWatchlist = new Set()
  for (const item of store.watchlist) {
    if (!idsWatchlist.has(item.content_id)) {
      const details = await getShowDetails(String(item.content_id), item.type as 'series' | 'movie')
      if (details) {
        watchlistDetails.value.push({
          id: details.id,
          title: details.name,
          rating: details.score ?? '7.9',
          imageSrc: details.image_url || '/images/placeholder.jpg',
          year: details.year || '',
          type: item.type as 'series' | 'movie',
        })
        idsWatchlist.add(item.content_id)
      }
    }
  }

  // Watched
  const idsWatched = new Set()
  for (const item of store.watched) {
    if (!idsWatched.has(item.content_id)) {
      const details = await getShowDetails(String(item.content_id), item.type as 'series' | 'movie')
      if (details) {
        watchedDetails.value.push({
          id: details.id,
          title: details.name,
          rating: details.score ?? '7.9',
          imageSrc: details.image_url || '/images/placeholder.jpg',
          year: details.year || '',
          type: item.type as 'series' | 'movie',
        })
        idsWatched.add(item.content_id)
      }
    }
  }

  // Favorites
  const idsFavorites = new Set()
  for (const item of store.favorites) {
    if (!idsFavorites.has(item.content_id)) {
      const details = await getShowDetails(String(item.content_id), item.type as 'series' | 'movie')
      if (details) {
        favoritesDetails.value.push({
          id: details.id,
          title: details.name,
          rating: details.score ?? '7.9',
          imageSrc: details.image_url || '/images/placeholder.jpg',
          year: details.year || '',
          type: item.type as 'series' | 'movie',
        })
        idsFavorites.add(item.content_id)
      }
    }
  }
})
</script>

<template>
  <div class="container">
    <SearchBar @search="handleSearch" />

    <MediaSection
      v-if="searchQuery && searchResults.length > 0"
      :infinite="false"
      title="Search results"
      :items="searchResults"
    />

    <template v-else>
      <MediaSection
        v-if="watchlistDetails.length > 0"
        :infinite="false"
        title="My Watchlist"
        :items="watchlistDetails"
      />
      <MediaSection v-if="watchedDetails.length > 0" title="My Watched" :items="watchedDetails" />
      <MediaSection
        v-if="favoritesDetails.length > 0"
        :infinite="false"
        title="My Favorites"
        :items="favoritesDetails"
      />
    </template>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  padding-bottom: 80px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
