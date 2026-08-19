<script setup>
import MovieList from './MovieList.vue'
import SearchBar from './SearchBar.vue'
import NoResultsView from '../../views/NoResultsView.vue'
import { useMovieStore } from '../../stores/movieStore'
import { computed } from 'vue'

const movieStore = useMovieStore()

const showNoResults = computed(
  () => movieStore.movies.length > 0 && movieStore.movieList.length === 0,
)
</script>

<template>
  <section class="px-6 py-6">
    <div
      class="flex items-center gap-3 rounded-xl border border-default bg-elevated p-4 dark:rounded-none dark:border-transparent dark:bg-transparent dark:p-0"
    >
      <div class="w-9 h-9 bg-green-500/15 rounded-lg flex items-center justify-center shrink-0">
        <UIcon name="i-heroicons-sparkles" class="text-green-400 size-5" />
      </div>
      <div>
        <h1 class="text-highlighted font-bold text-xl leading-tight">Descubrir</h1>
        <p class="text-muted text-sm">Explora películas y series populares</p>
      </div>
    </div>
  </section>
  <SearchBar />
  <NoResultsView v-if="showNoResults" />
  <MovieList v-else />
</template>
