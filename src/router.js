import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import AuthView from './views/AuthView.vue'
import RegistrationView from './views/RegistrationView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/auth', component: AuthView },
  { path: '/registration', component: RegistrationView },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router
