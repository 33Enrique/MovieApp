<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import MediaSection from '../components/MediaSection.vue'
import { useSearch, type MediaItem } from '../composables/useSearch'

// 1. Datos originales quemados en el componente
const recommendedMovies = ref<MediaItem[]>([
  { id: 1, rating: '7.9', imageSrc: '/images/Interestelar.jpg', title: 'Interestelar', year: '2014' },
  { id: 2, rating: '8.0', imageSrc: '/images/CaptainAmerica.jpg', title: 'Capitán América: Un nuevo mundo', year: '2025' },
  { id: 3, rating: '7.5', imageSrc: '/images/KarateKidLegend.jpg', title: 'Karate Kid Legends', year: '2025' },
  { id: 4, rating: '8.5', imageSrc: '/images/ToyStory.jpg', title: 'Toy Story', year: '1995' },
  { id: 5, rating: '8.5', imageSrc: '/images/Joker.jpg', title: 'Joker', year: '2019' },
  { id: 6, rating: '8.0', imageSrc: '/images/DyW.jpg', title: 'Deadpool & Wolverine', year: '2024' },
  { id: 7, rating: '7.5', imageSrc: '/images/elconjuro.jpg', title: 'El Conjuro', year: '2013' }
])

const popularSeries = ref<MediaItem[]>([
  { id: 8, rating: '9.5', imageSrc: '/images/The lastOfUS.jpg', title: 'The Last of Us', year: '2024' },
  { id: 9, rating: '8.7', imageSrc: '/images/Yellowstone.jpg', title: 'Yellowstone', year: '2022' },
  { id: 10, rating: '8.5', imageSrc: '/images/Cobra-Kai.jpg', title: 'Cobra Kai', year: '2022' },
  { id: 11, rating: '9.3', imageSrc: '/images/Breaking Bad.jpg', title: 'Breaking Bad', year: '2013' },
  { id: 12, rating: '8.7', imageSrc: '/images/HouseOfDragon.jpg', title: 'House of Dragon', year: '2022' },
  { id: 13, rating: '8.5', imageSrc: '/images/LOKI.jpg', title: 'Loki', year: '2021' },
  { id: 14, rating: '8.6', imageSrc: '/images/Chernobyl.jpg', title: 'Chernobyl', year: '2019' }
])

// 2. Se utiliza el Composable para cada sección
const { searchQuery: movieSearchQuery, filteredItems: filteredMovies } = useSearch(recommendedMovies)
const { searchQuery: seriesSearchQuery, filteredItems: filteredSeries } = useSearch(popularSeries)

// 3. Un solo componente para ambas busquedas 
const handleSearch = (query: string) => {
  movieSearchQuery.value = query
  seriesSearchQuery.value = query
}
</script>

<template>
  <div class="container">
    <SearchBar @search="handleSearch" />
    
    <MediaSection 
      title="Recommended movies" 
      :items="filteredMovies" 
    />
    
    <MediaSection 
      title="Popular TV series" 
      :items="filteredSeries" 
    />
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  padding-bottom: 80px; 
  max-width: 1400px; 
  margin: 0 auto; 
}


@media (max-width: 768px) {
  .container {
    padding: 15px;
    padding-bottom: 80px;
  }
}
</style>
