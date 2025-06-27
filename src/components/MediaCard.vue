<template>
  <router-link :to="`/details/${type}/${id}`" class="card">
    <div class="rating">{{ '7.9' }}</div>
    <img :src="imageSrc" :alt="title" />
    <p class="title">{{ title }}</p>
    <span class="year">2025</span>
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  id: string | number
  rating: string | number
  imageSrc: string
  title: string
  year: string | number
  type: 'series' | 'movie'
}>()
</script>

<style scoped>
.card {
  position: relative;
  min-width: 150px;
  margin-right: 15px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #2c2c44;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 2;
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.title {
  margin: 8px 10px 4px 10px;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.year {
  color: #aaa;
  font-size: 12px;
  padding: 0 10px 10px 10px;
}

@media (min-width: 768px) {
  .card {
    min-width: 180px;
  }
  .card img {
    height: 240px;
  }
}

@media (min-width: 1024px) {
  .card {
    min-width: 200px;
  }
  .card img {
    height: 280px;
  }
}
</style>
