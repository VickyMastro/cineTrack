<script setup>
import { ref, computed } from 'vue'
import { useMovieStore } from '../../stores/movieStore'
/* cambiar a false */
const showFilters = ref(false)
const movieStore = useMovieStore()

async function completeItems() {
  await movieStore.getGenres()
}
completeItems()

const typeItems = [
  { label: 'Todos', value: 'all' },
  { label: 'Peliculas', value: 'movie' },
  { label: 'Series', value: 'serie' },
]
const genresItems = computed(() => [
  { label: 'Todos', value: 'all' },
  ...movieStore.genres.map((g) => ({ label: g.name, value: g.id })),
])
const yearItems = computed(() => {
  const years = [...new Set(movieStore.movies.map((m) => m.release_date.slice(0, 4)))]
  return [
    { label: 'Todos', value: 'all' },
    ...years.sort((a, b) => b - a).map((y) => ({ label: y, value: y })),
  ]
})

function handleClearFilters() {
  movieStore.clearFilters()
}
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <div class="flex items-center gap-3 w-full max-w-3xl">
      <UInput
        icon="i-heroicons-magnifying-glass"
        size="md"
        variant="outline"
        placeholder="Buscar películas o series..."
        class="flex-1"
      />
      <UButton
        color="neutral"
        variant="outline"
        icon="i-heroicons-adjustments-horizontal"
        @click="showFilters = !showFilters"
      >
        Filtros
      </UButton>
    </div>
    <!-- filtros -->
    <div
      v-if="showFilters"
      class="w-full max-w-3xl border border-neutral-800 rounded-xl p-4 flex flex-col gap-3"
    >
      <div class="flex justify-end">
        <button
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
          @click="handleClearFilters()"
        >
          <UIcon name="i-heroicons-x-mark" class="text-green-400 size-5" />
          Limpiar Filtros
        </button>
      </div>
      <div class="flex items-center justify-between gap-6">
        <div>
          <span class="p-4 text-neutral-400 text-xs">Tipo</span>
          <USelect
            v-model="movieStore.filters.type"
            :items="typeItems"
            class="w-40"
            :ui="{ content: 'z-[100]' }"
          />
        </div>
        <div>
          <span class="p-4 text-neutral-400 text-xs">Género</span>
          <USelect
            v-model="movieStore.filters.genre"
            :items="genresItems"
            class="w-40"
            :ui="{ content: 'z-[100]' }"
          />
        </div>
        <div>
          <span class="p-4 text-neutral-400 text-xs">Año</span>
          <USelect
            v-model="movieStore.filters.year"
            :items="yearItems"
            class="w-40"
            :ui="{ content: 'z-[100]' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
