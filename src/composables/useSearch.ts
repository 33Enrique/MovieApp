import { ref, computed, type Ref } from 'vue'

// Se define una interfaz aquí para que pueda ser reutilizada
export interface MediaItem {
  id: string | number
  rating: string | number
  imageSrc: string
  title: string
  year: string | number
}

// Composable para manejar la búsqueda de items
export function useSearch(
  initialItems: Ref<MediaItem[]>
) {
  
  const searchQuery = ref('')

  
  const filteredItems = computed(() => {
 
    if (!searchQuery.value) {
      return initialItems.value
    }
    
    return initialItems.value.filter(item =>
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  
  return {
    searchQuery,
    filteredItems
  }
} 