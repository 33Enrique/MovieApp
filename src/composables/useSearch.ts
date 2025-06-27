import { ref } from 'vue'
import type { MediaItem } from '@/services/thetvdbService'

export function useSearch() {
  const searchQuery = ref('')
  const searchResults = ref<MediaItem[]>([])
  const isLoading = ref(false)

  const search = async (query: string) => {
    searchQuery.value = query
    isLoading.value = true
    const { searchTheTVDB } = await import('@/services/thetvdbService')
    searchResults.value = await searchTheTVDB(query)
    isLoading.value = false
  }

  return {
    searchQuery,
    searchResults,
    isLoading,
    search,
  }
}
