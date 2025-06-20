<template>
  <header>
    <div class="search-bar">
      <input 
        type="text" 
        placeholder="Search" 
        v-model="searchQuery"
        @input="handleSearch"
      />
      <img class="avatar" src="/images/avatar.jpg" alt="Avatar" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const emit = defineEmits<{
  search: [query: string]
}>()

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<style scoped>
header {
  padding: 20px 0;
  border-bottom: 1px solid #5a4fcf;
  margin-bottom: 20px;
  background: #232336;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  background: #232336;
  border-radius: 30px;
  padding: 8px 16px;
  border: 2px solid #5a4fcf;
}

.search-bar input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  background: transparent;
  color: #fff;
}

.search-bar input:focus {
  border: none;
  box-shadow: none;
}

.search-bar input::placeholder {
  color: #aaa;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar:hover {
  transform: scale(1.05);
}
</style> 