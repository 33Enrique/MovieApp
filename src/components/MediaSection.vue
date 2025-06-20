<template>
  <section class="section">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <span class="arrow">&rarr;</span>
    </div>
    <div class="horizontal-scroll">
      <MediaCard
        v-for="item in items"
        :key="item.id"
        :rating="item.rating"
        :image-src="item.imageSrc"
        :title="item.title"
        :year="item.year"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import MediaCard from './MediaCard.vue'

interface MediaItem {
  id: string | number
  rating: string | number
  imageSrc: string
  title: string
  year: string | number
}

interface Props {
  title: string
  items: MediaItem[]
}

defineProps<Props>()
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

.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding-bottom: 10px;
}

.horizontal-scroll::-webkit-scrollbar {
  height: 6px;
}

.horizontal-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.horizontal-scroll::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 