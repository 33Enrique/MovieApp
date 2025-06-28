import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMyShowsStore = defineStore('myShows', () => {
  const watchlist = ref<string[]>([])
  const watched = ref<string[]>([])
  const favorites = ref<string[]>([])
  const loading = ref(false)

  // Cargar listas del backend
  async function fetchLists(userId: string) {
    loading.value = true
    try {
      const res = await fetch(`http://localhost:3002/api/user-content/${userId}`)
      const data = await res.json()
      watchlist.value = data.watchlist || []
      watched.value = data.watched || []
      favorites.value = data.favorites || []
    } catch (e) {
      watchlist.value = []
      watched.value = []
      favorites.value = []
    } finally {
      loading.value = false
    }
  }

  // Agregar show a una lista
  async function addToList(userId: string, contentId: string, status: string) {
    await fetch('http://localhost:3002/api/user-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, contentId, status })
    })
    await fetchLists(userId)
  }

  // Eliminar show de una lista
  async function removeFromList(userId: string, contentId: string, status: string) {
    await fetch('http://localhost:3002/api/user-content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, contentId, status })
    })
    await fetchLists(userId)
  }

  return {
    watchlist,
    watched,
    favorites,
    loading,
    fetchLists,
    addToList,
    removeFromList
  }
}) 