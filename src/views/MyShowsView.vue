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
  for (const id of store.watchlist) {
    const details = await getShowDetails(String(id), 'series')
    if (details) {
      watchlistDetails.value.push({
        id: details.id,
        title: details.name,
        rating: details.score ?? '7.9',
        imageSrc: details.image || '/images/placeholder.jpg',
        year: details.year || '',
        type: details.type || 'series',
      })
    }
  }

  // Watched
  for (const id of store.watched) {
    const details = await getShowDetails(String(id), 'series')
    if (details) {
      watchedDetails.value.push({
        id: details.id,
        title: details.name,
        rating: details.score ?? '7.9',
        imageSrc: details.image || '/images/placeholder.jpg',
        year: details.year || '',
        type: details.type || 'series',
      })
    }
  }

  // Favorites
  for (const id of store.favorites) {
    const details = await getShowDetails(String(id), 'series')
    if (details) {
      favoritesDetails.value.push({
        id: details.id,
        title: details.name,
        rating: details.score ?? '7.9',
        imageSrc: details.image || '/images/placeholder.jpg',
        year: details.year || '',
        type: details.type || 'series',
      })
    }
  }
})
</script>

<template>
  <div class="container">
    <SearchBar @search="handleSearch" />

    <MediaSection
      v-if="searchQuery && searchResults.length > 0"
      title="Search results"
      :items="searchResults"
    />
    <template v-else>
      <MediaSection
        v-if="watchlistDetails.length > 0"
        title="My Watchlist"
        :items="watchlistDetails"
      />
      <MediaSection v-if="watchedDetails.length > 0" title="My Watched" :items="watchedDetails" />
      <MediaSection
        v-if="favoritesDetails.length > 0"
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
