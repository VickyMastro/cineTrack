<script setup>
import DisplayInformation from './DisplayInformation.vue'
import { useMovieStore } from '../../stores/movieStore.js'
import DoughnutChart from '../base/charts/DoughnutChart.vue'
import FavoriteGenresChart from '../base/charts/FavoriteGenresChart.vue'

const movieStore = useMovieStore()
</script>

<template>
  <section class="px-6 py-6">
    <div
      class="flex items-center gap-3 rounded-xl border border-default bg-elevated p-4 dark:rounded-none dark:border-transparent dark:bg-transparent dark:p-0"
    >
      <div class="w-10 h-10 bg-green-500/15 rounded-lg flex items-center justify-center shrink-0">
        <UIcon name="i-heroicons-chart-bar-square" class="text-green-400 size-5" />
      </div>
      <div>
        <h1 class="text-highlighted font-bold text-xl leading-tight">Estadísticas</h1>
        <p class="text-muted text-sm">Tu actividad y hábitos de visualización</p>
      </div>
    </div>
  </section>
  <section class="px-6 pb-6">
    <div class="grid grid-cols-4 gap-4">
      <DisplayInformation
        icon="i-heroicons-eye"
        color="bg-green-500/15 text-green-400"
        label="Contenido visto"
        :value="movieStore.watchedIds.size"
      />
      <DisplayInformation
        icon="i-heroicons-clock"
        color="bg-blue-500/15 text-blue-400"
        label="Horas totales"
        :value="`${movieStore.watchedIds.size * 2}h`"
      />
      <DisplayInformation
        icon="i-heroicons-star"
        color="bg-amber-500/15 text-amber-400"
        label="Rating promedio"
        :value="movieStore.averageRating"
      />
      <DisplayInformation
        icon="i-heroicons-heart"
        color="bg-red-500/15 text-red-400"
        label="Favoritas"
        :value="movieStore.favoriteIds.size"
      />
    </div>
  </section>
  <section class="px-6 pb-6">
    <div class="grid grid-cols-2 gap-4">
      <DoughnutChart />
      <FavoriteGenresChart />
    </div>
  </section>
</template>
