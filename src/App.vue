<script setup>
import { onMounted } from 'vue'
import { useMovieStore } from './stores/movieStore'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()
const movieStore = useMovieStore()

onMounted(async () => {
  await userStore.restoreSession()
  await movieStore.getFavoritesMovies()
  await movieStore.getBookmarksMovies()
})
</script>

<template>
  <UApp>
    <RouterView />
  </UApp>
</template>
