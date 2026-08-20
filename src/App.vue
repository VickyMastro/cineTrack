<script setup>
import { onMounted, watch } from 'vue'
import { useMovieStore } from './stores/movieStore'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()
const movieStore = useMovieStore()

onMounted(async () => {
  await movieStore.getMovies()
})

watch(
  [() => userStore.accessToken, () => userStore.user.id],
  async ([token, id]) => {
    if (!token || !id) {
      movieStore.clearUserActions()
      return
    }

    try {
      await movieStore.getMoviesByAction()
    } catch {
      movieStore.clearUserActions()
    }
  },
  { immediate: true },
)
</script>

<template>
  <UApp>
    <RouterView />
  </UApp>
</template>
