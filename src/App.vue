<script setup>
import { onMounted, watch } from 'vue'
import { useMovieStore } from './stores/movieStore'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()
const movieStore = useMovieStore()

onMounted(async () => {
  await userStore.restoreSession()
  await movieStore.getMovies()
  if (userStore.accessToken) {
    await movieStore.getMoviesByAction()
  }
})

watch(
  () => userStore.user.id,
  async (newId, oldId) => {
    if (newId === oldId) return

    if (!newId) {
      movieStore.clearUserActions()
      return
    }

    await movieStore.getMoviesByAction()
  },
)
</script>

<template>
  <UApp>
    <RouterView />
  </UApp>
</template>
