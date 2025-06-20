<template>
  <nav class="bottom-nav">
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
  {
    id: 'explore',
    href: '#',
    icon: '/iconos/explore.png',
    label: 'Explore',
    isActive: true
  },
  {
    id: 'shows',
    href: '#',
    icon: '/iconos/shows.png',
    label: 'My shows',
    isActive: false
  },
  {
    id: 'calendar',
    href: '#',
    icon: '/iconos/calendar.png',
    label: 'Calendar',
    isActive: false
  },
  {
    id: 'notifications',
    href: '#',
    icon: '/iconos/notifications.png',
    label: 'Notifications',
    isActive: false
  }
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
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #232336; 
  border-top: 1px solid #5a4fcf;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100; 
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #fff;
  transition: color 0.2s ease;
  padding: 8px 12px;
  border-radius: 8px;
}

.nav-item:hover {
  color: #a99cff;
}

.nav-item.active {
  color: #a99cff;
  background: rgba(90, 79, 207, 0.1);
}

.nav-item img {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.nav-item span {
  font-size: 12px;
  font-weight: 500;
}
</style> 