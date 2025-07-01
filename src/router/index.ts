import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailsView from '../views/DetailsView.vue'
import MyShowsView from '../views/MyShowsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/details/:id',
      name: 'details',
      component: DetailsView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/myshows',
      name: 'myshows',
      component: MyShowsView,
    },
    {
      path: '/watch/:type-:id',
      name: 'watch',
      component: () => import('../views/WatchView.vue'),
    },
  ],
})

export default router
