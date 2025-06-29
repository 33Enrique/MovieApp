<template>
  <section class="section">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <span class="arrow" @click="nextSlide">&rarr;</span>
    </div>
    <div class="slider-wrapper">
      <div class="slider-track" :style="trackStyle" ref="track">
        <MediaCard
          v-for="(item, index) in multiDuplicatedItems"
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
import { ref, computed, nextTick } from 'vue'
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
}

const props = defineProps<Props>()

const multiDuplicatedItems = computed(() => [
  ...props.items,
  ...props.items,
  ...props.items,
  ...props.items,
])

const track = ref<HTMLDivElement | null>(null)
const cardWidth = 220
const gap = 15
const step = cardWidth + gap

const currentIndex = ref(props.items.length * 2)
const currentTranslate = ref(currentIndex.value * step)
const transitionEnabled = ref(true)

const trackStyle = computed(() => ({
  transform: `translateX(-${currentTranslate.value}px)`,
  transition: transitionEnabled.value ? 'transform 0.5s ease' : 'none',
}))

const nextSlide = () => {
  currentIndex.value++
  currentTranslate.value = currentIndex.value * step

  if (currentIndex.value >= props.items.length * 3) {
    setTimeout(() => {
      transitionEnabled.value = false
      currentIndex.value = props.items.length * 2
      currentTranslate.value = currentIndex.value * step
      nextTick(() => {
        transitionEnabled.value = true
      })
    }, 500)
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
