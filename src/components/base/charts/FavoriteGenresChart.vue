<script setup>
import { computed } from 'vue'
import { useMovieStore } from '../../../stores/movieStore'

const movieStore = useMovieStore()
const genres = computed(() => movieStore.favoritesGenres)
const topGenres = computed(() => genres.value.slice(0, 4))
const maxCount = computed(() => Math.max(...topGenres.value.map((genre) => genre.count)))

function barWidth(count) {
  return `${(count / maxCount.value) * 100}%`
}
</script>

<template>
  <div class="fondo">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
        <UIcon name="i-heroicons-arrow-trending-up" class="text-green-400 size-4" />
      </div>
      <h2 class="text-highlighted font-bold">Géneros favoritos</h2>
    </div>

    <div
      v-if="!topGenres.length"
      class="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center"
    >
      <p class="text-highlighted text-lg font-medium">Todavía no tienes géneros favoritos</p>
      <p class="text-muted text-sm flex flex-wrap items-center justify-center gap-1">
        Toca el
        <UIcon name="i-heroicons-heart" class="size-3.5 text-red-400" />
        en una película para agregarla
      </p>
    </div>
    <div v-else class="flex flex-col gap-4">
      <div v-for="genre in topGenres" :key="genre.id">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-highlighted text-sm font-medium">{{ genre.name }}</span>
          <span class="text-muted text-xs">{{ genre.count }} títulos</span>
        </div>
        <div class="h-1.5 w-full rounded-full bg-accented overflow-hidden">
          <div
            class="h-full rounded-full bg-green-500"
            :style="{ width: barWidth(genre.count) }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../../../assets/css/main.css";

.fondo {
  @apply relative flex h-full min-h-64 w-full flex-col rounded-xl border border-default bg-elevated p-6;
}
</style>
