import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from './stores/userStore'
import HomeView from './views/HomeView.vue'
import AuthView from './views/AuthView.vue'
import RegistrationView from './views/RegistrationView.vue'

const routes = [
  { path: '/', component: HomeView, meta: { requiresAuth: true } },
  { path: '/auth', component: AuthView },
  { path: '/registration', component: RegistrationView },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (!userStore.sessionRestored) {
    await userStore.restoreSession()
  }

  if (to.meta.requiresAuth && !userStore.accessToken) {
    return '/auth'
  }
})

export default router
