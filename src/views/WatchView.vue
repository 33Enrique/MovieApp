<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces para los tipos de datos
interface ShowDetails {
  name: string
  overview?: string
  [key: string]: any
}

interface CastMember {
  name: string
  image?: string
}

interface Trailer {
  thumbnail?: string
  url: string
}

interface NextEpisode {
  date: string
  code: string
  title: string
}

interface Season {
  name: string
  number?: number
  progress: number
  total: number
  completed: boolean
}

const route = useRoute()
const loading = ref(true)
const error = ref('')

// Datos que vendrán del backend
const showDetails = ref<ShowDetails | null>(null)
const cast = ref<CastMember[]>([])
const trailers = ref<Trailer[]>([])
const images = ref<string[]>([])
const nextEpisode = ref<NextEpisode | null>(null)
const seasons = ref<Season[]>([])

// Función para obtener datos del show
async function fetchShowData() {
  loading.value = true
  error.value = ''
  
  try {
    const { type, id } = route.params
    const response = await fetch(`http://localhost:3002/api/content/${type}/${id}/full`)
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Asignar datos del backend
    showDetails.value = data.details
    cast.value = data.cast || []
    trailers.value = data.trailers || []
    images.value = data.images || []
    nextEpisode.value = data.nextEpisode
    seasons.value = data.seasons || []
    
    console.log('Datos obtenidos del backend:', data)
    
  } catch (err) {
    console.error('Error al obtener datos del show:', err)
    error.value = 'Error al cargar los datos del show'
  } finally {
    loading.value = false
  }
}

function toggleSeasonComplete(index: number) {
  const season = seasons.value[index]
  season.completed = !season.completed
  season.progress = season.completed ? season.total : 0
}

onMounted(() => {
  fetchShowData()
})
</script>

<template>
  <div class="watch-view-container">
    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Cargando información del show...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchShowData" class="retry-btn">Reintentar</button>
    </div>

    <!-- Contenido principal -->
    <div v-else>
      <!-- Información del show -->
      <section v-if="showDetails" class="show-info section-divider">
        <h2>{{ showDetails.name }}</h2>
        <p v-if="showDetails.overview" class="overview">{{ showDetails.overview }}</p>
      </section>

      <!-- Cast -->
      <section v-if="cast.length > 0" class="cast-section section-divider">
        <h3>Cast</h3>
        <div class="cast-list">
          <div v-for="actor in cast" :key="actor.name" class="cast-item">
            <img :src="actor.image || 'https://via.placeholder.com/60x60?text=?'" :alt="actor.name" />
            <span>{{ actor.name }}</span>
          </div>
        </div>
      </section>

      <!-- Mensaje si no hay cast -->
      <section v-else class="cast-section section-divider">
        <h3>Cast</h3>
        <p class="no-data">No hay información de cast disponible</p>
      </section>

      <!-- Trailers -->
      <section v-if="trailers.length > 0" class="trailers-section section-divider">
        <h3>Trailers</h3>
        <div class="trailers-list">
          <a v-for="trailer in trailers" :key="trailer.url" :href="trailer.url" target="_blank" class="trailer-link">
            <div class="trailer-thumb-wrapper">
              <img v-if="trailer.thumbnail" :src="trailer.thumbnail" alt="Trailer thumbnail" class="trailer-thumb" />
              <div v-else class="trailer-default-icon">🎬</div>
              <div class="play-btn">▶</div>
            </div>
            <span class="trailer-label">Trailer</span>
          </a>
        </div>
      </section>

      <!-- Mensaje si no hay trailers -->
      <section v-else class="trailers-section section-divider">
        <h3>Trailers</h3>
        <p class="no-data">No hay trailers disponibles</p>
      </section>

      <!-- Imágenes -->
      <section v-if="images.length > 0" class="images-section section-divider">
        <h3>Images</h3>
        <div class="images-list">
          <img v-for="(img, index) in images" :key="index" :src="img" alt="Show image" />
        </div>
      </section>

      <!-- Mensaje si no hay imágenes -->
      <section v-else class="images-section section-divider">
        <h3>Images</h3>
        <p class="no-data">No hay imágenes disponibles</p>
      </section>

      <!-- Próximo episodio -->
      <section v-if="nextEpisode" class="next-episode-section section-divider">
        <h3>Next Episode</h3>
        <div class="next-episode-card">
          <div class="calendar-icon">📅</div>
          <div>
            <div class="date">{{ nextEpisode.date }}</div>
            <div class="code">{{ nextEpisode.code }}, {{ nextEpisode.title }}</div>
          </div>
        </div>
      </section>

      <!-- Mensaje si no hay próximo episodio -->
      <section v-else class="next-episode-section section-divider">
        <h3>Next Episode</h3>
        <p class="no-data">No hay información del próximo episodio</p>
      </section>

      <!-- Temporadas -->
      <section v-if="seasons.length > 0" class="seasons-section">
        <h3>Seasons</h3>
        <div class="seasons-list">
          <div
            v-for="(season, idx) in seasons"
            :key="season.name + '-' + idx"
            class="season-item"
            :class="{ completed: season.completed }"
          >
            <label class="season-checkbox">
              <input
                type="checkbox"
                :checked="season.completed"
                @change="toggleSeasonComplete(idx)"
              />
              <span class="checkmark"></span>
            </label>
            <span class="season-title">
              <template v-if="season.number !== undefined && season.number !== null">
                Season {{ season.number }}<span v-if="season.name && season.name !== ('Season ' + season.number)"> - {{ season.name }}</span>
              </template>
              <template v-else>
                {{ season.name }}
              </template>
            </span>
            <template v-if="season.total > 0">
              <div class="progress-bar">
                <div class="progress" :style="{ width: (season.progress / season.total * 100) + '%' }"></div>
              </div>
              <span class="progress-text">{{ season.progress }}/{{ season.total }}</span>
            </template>
            <template v-else>
              <span class="progress-text">Sin episodios</span>
            </template>
          </div>
        </div>
      </section>

      <!-- Mensaje si no hay temporadas -->
      <section v-else class="seasons-section">
        <h3>Seasons</h3>
        <p class="no-data">No hay información de temporadas disponible</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.watch-view-container {
  padding: 20px 0 20px 0;
  color: #fff;
  max-width: 420px;
  margin: 0 auto;
  background: none;
}

.loading-state, .error-state {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #28284a;
  border-top: 4px solid #a99cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  background: #a99cff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.retry-btn:hover {
  background: #8b7fd8;
}

.show-info {
  text-align: center;
  margin-bottom: 20px;
}

.show-info h2 {
  margin: 0 0 10px 0;
  color: #a99cff;
}

.overview {
  font-size: 14px;
  line-height: 1.4;
  color: #ccc;
  margin: 0;
}

.no-data {
  color: #888;
  font-style: italic;
  text-align: center;
  margin: 20px 0;
}

.section-divider {
  border-bottom: 2px solid #28284a;
  margin-bottom: 12px;
  padding-bottom: 12px;
}

.cast-section {
  padding-top: 8px;
}

.cast-section .cast-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 0;
}

.cast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
}

.cast-item img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 4px;
}

.trailers-list {
  display: flex;
  gap: 10px;
  margin-bottom: 0;
  overflow-x: auto;
}

.trailer-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.trailer-thumb-wrapper {
  position: relative;
  width: 120px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trailer-default-icon {
  width: 120px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #232336;
  border-radius: 8px;
  font-size: 32px;
}

.trailer-label {
  margin-top: 4px;
  font-size: 13px;
  color: #a99cff;
}

.trailer-thumb {
  width: 120px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  position: relative;
}

.play-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: white;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.images-list {
  display: flex;
  gap: 10px;
  margin-bottom: 0;
}

.images-list img {
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.next-episode-card {
  display: flex;
  align-items: center;
  background: #232336;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 0;
}

.calendar-icon {
  font-size: 28px;
  margin-right: 12px;
}

.seasons-section {
  margin-top: 24px;
}

.seasons-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 4px;
}

.season-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #28284a;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s;
}

.season-item.completed {
  background: #3a3a6a;
  opacity: 0.85;
}

.season-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.season-checkbox input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
}

.checkmark {
  width: 20px;
  height: 20px;
  background: #232336;
  border: 2px solid #a99cff;
  border-radius: 6px;
  display: inline-block;
  position: relative;
  margin-right: 6px;
}

.season-checkbox input[type="checkbox"]:checked + .checkmark {
  background: #a99cff;
  border-color: #a99cff;
}

.season-checkbox input[type="checkbox"]:checked + .checkmark:after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.season-title {
  font-weight: 500;
  min-width: 80px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #444;
  border-radius: 5px;
  margin: 0 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}

.progress {
  height: 100%;
  background: #a99cff;
  transition: width 0.3s;
}

.progress-text {
  font-size: 13px;
  color: #a99cff;
  min-width: 40px;
  text-align: right;
}

.cast-list, .trailers-list {
  scrollbar-width: thin;
  scrollbar-color: #3a3a6a #232336;
}

.cast-list::-webkit-scrollbar, .trailers-list::-webkit-scrollbar {
  height: 8px;
  background: #232336;
  border-radius: 6px;
}

.cast-list::-webkit-scrollbar-thumb, .trailers-list::-webkit-scrollbar-thumb {
  background: #3a3a6a;
  border-radius: 6px;
}
</style> 