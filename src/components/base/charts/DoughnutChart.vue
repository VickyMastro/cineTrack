<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { useMovieStore } from '../../../stores/movieStore'

ChartJS.register(ArcElement, Tooltip, Legend)

const movieStore = useMovieStore()

const moviesCount = computed(() => movieStore.mediaCounts.movies.length)
const seriesCount = computed(() => movieStore.mediaCounts.series.length)
const totalCount = computed(() => moviesCount.value + seriesCount.value)

const data = computed(() => ({
  labels: ['Películas', 'Series'],
  datasets: [
    {
      data: [moviesCount.value, seriesCount.value],
      backgroundColor: ['#00d091', '#2b7fff'],
      borderWidth: 0,
      cutout: '75%',
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
}
</script>

<template>
  <div class="fondo">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
        <UIcon name="i-heroicons-film" class="text-green-400 size-4" />
      </div>
      <h2 class="text-white font-bold">Distribución de contenido</h2>
    </div>

    <div
      v-if="!totalCount"
      class="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center"
    >
      <p class="text-white text-lg font-medium">Todavía no tienes contenido visto</p>
      <p class="text-neutral-400 text-sm flex flex-wrap items-center justify-center gap-1">
        Toca el
        <UIcon name="i-heroicons-eye" class="size-3.5 text-green-400" />
        en una película para agregarla
      </p>
    </div>

    <div v-else class="flex items-center gap-10">
      <div class="relative w-40 h-40 shrink-0">
        <Doughnut :data="data" :options="options" />
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-white font-bold text-3xl">{{ totalCount }}</span>
        </div>
      </div>

      <!-- division peliculas y series -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#00d091] shrink-0"></span>
          <div>
            <p class="text-white text-sm font-medium">Películas</p>
            <p class="text-neutral-400 text-xs">{{ moviesCount }} títulos</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-neutral-700 shrink-0"></span>
          <div>
            <p class="text-white text-sm font-medium">Series</p>
            <p class="text-neutral-400 text-xs">{{ seriesCount }} títulos</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.fondo {
  @apply relative flex h-full min-h-64 w-full flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-6;
}
</style>
