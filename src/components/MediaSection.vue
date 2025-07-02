<template>
  <section class="section">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <span v-if="displayItems.length > 1" class="arrow" @click="nextSlide">&rarr;</span>
    </div>
    <div class="slider-wrapper">
      <div class="slider-track" :style="trackStyle" ref="track">
        <MediaCard
          v-for="(item, index) in displayItems"
          :key="`${item.id}-${index}`"
          :id="item.id"
          :title="item.title"
          :imageSrc="item.imageSrc"
          :rating="item.rating"
          :year="item.year"
          :type="item.type"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import MediaCard from './MediaCard.vue'

interface MediaItem {
  id: string | number
  rating: string | number
  imageSrc: string
  title: string
  year: string | number
  type: 'series' | 'movie'
}

interface Props {
  title: string
  items: MediaItem[]
  infinite?: boolean
}

const props = defineProps<Props>()

const infinite = computed(() => props.infinite === true)
const N = computed(() => props.items.length)

// Para el loop, siempre duplicamos los items (mínimo 2)
const displayItems = computed(() => {
  if (infinite.value && N.value > 0) {
    return [...props.items, ...props.items]
  }
  return props.items
})

const track = ref<HTMLDivElement | null>(null)
const cardWidth = 220
const gap = 15
const step = cardWidth + gap

const baseIndex = computed(() => (infinite.value && N.value > 0 ? 0 : 0))
const currentIndex = ref(baseIndex.value)
const currentTranslate = ref(currentIndex.value * step)
const transitionEnabled = ref(true)

const trackStyle = computed(() => ({
  transform: `translateX(-${currentTranslate.value}px)`,
  transition: transitionEnabled.value ? 'transform 0.5s ease' : 'none',
}))

watch(
  () => props.items,
  () => {
    currentIndex.value = baseIndex.value
    currentTranslate.value = currentIndex.value * step
  },
)

const nextSlide = () => {
  if (infinite.value && N.value > 0) {
    currentIndex.value++
    currentTranslate.value = currentIndex.value * step
    // Si llegamos al final de la primera copia, saltamos al inicio del loop
    if (currentIndex.value === N.value) {
      setTimeout(() => {
        transitionEnabled.value = false
        currentIndex.value = 0
        currentTranslate.value = 0
        nextTick(() => {
          transitionEnabled.value = true
        })
      }, 500)
    }
  } else {
    // Solo desplazar hasta el final
    if (currentIndex.value < displayItems.value.length - 1) {
      currentIndex.value++
      currentTranslate.value = currentIndex.value * step
    }
  }
}
</script>

<style scoped>
.section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.arrow {
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s ease;
  user-select: none;
}

.arrow:hover {
  transform: translateX(5px);
}

.slider-wrapper {
  overflow: hidden;
  width: 100%;
}

.slider-track {
  display: flex;
  gap: 15px;
}
</style>
