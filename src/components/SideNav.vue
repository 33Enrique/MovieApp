<template>
  <nav class="side-nav">
    <div class="logo-container">
      
      <h3>MovieApp</h3>
    </div>
    <a 
      v-for="item in navItems" 
      :key="item.id"
      :href="item.href" 
      :class="['nav-item', { active: item.isActive }]"
      @click.prevent="handleNavClick(item.id)"
    >
      <img :src="item.icon" :alt="item.label" />
      <span>{{ item.label }}</span>
    </a>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface NavItem {
  id: string
  href: string
  icon: string
  label: string
  isActive: boolean
}

const navItems = ref<NavItem[]>([
  { id: 'explore', href: '#', icon: '/iconos/explore.png', label: 'Explore', isActive: true },
  { id: 'shows', href: '#', icon: '/iconos/shows.png', label: 'My shows', isActive: false },
  { id: 'calendar', href: '#', icon: '/iconos/calendar.png', label: 'Calendar', isActive: false },
  { id: 'notifications', href: '#', icon: '/iconos/notifications.png', label: 'Notifications', isActive: false }
])

const emit = defineEmits<{
  navChange: [itemId: string]
}>()

const handleNavClick = (itemId: string) => {
  navItems.value.forEach(item => {
    item.isActive = item.id === itemId
  })
  emit('navChange', itemId)
}
</script>

<style scoped>
.side-nav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 240px;
  background: #1c1c30;
  border-right: 1px solid #5a4fcf;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 100;
  display: none; 
}


@media (min-width: 768px) {
  .side-nav {
    display: flex;
  }
}

.logo-container {
  margin-bottom: 30px;
  text-align: center;
}

.nav-item {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-item:hover {
  background-color: #2c2c44;
}

.nav-item.active {
  background-color: #5a4fcf;
  color: #fff;
  font-weight: 600;
}

.nav-item img {
  width: 24px;
  height: 24px;
  margin-right: 15px;
  filter: invert(1);
}

.nav-item.active img {
  filter: none;
}

.nav-item span {
  font-size: 16px;
}
</style> 