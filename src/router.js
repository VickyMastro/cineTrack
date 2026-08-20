import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from './stores/userStore'
import HomeView from './views/HomeView.vue'
import AuthView from './views/AuthView.vue'
import RegistrationView from './views/RegistrationView.vue'
import LibraryView from './views/LibraryView.vue'
import StatsView from './views/StatsView.vue'
import ProfileView from './views/ProfileView.vue'
import RecoveryPassword from './components/password/RecoveryPassword.vue'

const routes = [
  { path: '/', component: HomeView, meta: { requiresAuth: true } },
  { path: '/auth', component: AuthView },
  { path: '/recovery-password', component: RecoveryPassword },
  { path: '/registration', component: RegistrationView },
  { path: '/library', component: LibraryView, meta: { requiresAuth: true } },
  { path: '/stats', component: StatsView, meta: { requiresAuth: true } },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (to.path === '/recovery-password') {
    await userStore.applyRecoveryFromUrl()
    return
  }

  if (!userStore.sessionRestored) {
    await userStore.restoreSession()
  }

  if (to.meta.requiresAuth && !userStore.accessToken) {
    return '/auth'
  }
})

export default router
