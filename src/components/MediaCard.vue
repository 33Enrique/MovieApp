<template>
  <div class="card">
    <div class="rating">{{ rating }}</div>
    <img :src="imageSrc" :alt="title">
    <p>{{ title }}</p>
    <span class="year">({{ year }})</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rating: string | number
  imageSrc: string
  title: string
  year: string | number
}

defineProps<Props>()
</script>

<style scoped>
.card {
  position: relative;
  min-width: 150px;
  margin-right: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  background-color: #2c2c44; 
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
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card p {
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

/* Mediasss Queries para Responsividad */
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