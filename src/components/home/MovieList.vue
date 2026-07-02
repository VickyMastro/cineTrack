<script setup>
import { useMovieStore } from '../../stores/movieStore'
const imageBase = 'https://image.tmdb.org/t/p/original'
const movieStore = useMovieStore()

async function getMovies() {
  await movieStore.getMovies()
}
getMovies()

function type(movie) {
  return movie.type === 'movie' ? 'Pelicula' : 'Serie'
}
</script>

<template>
  <div class="px-6 pt-2">{{ movieStore.movies.length }} Resultados</div>
  <div class="grid grid-cols-5 gap-4 p-6">
    <article
      v-for="movie in movieStore.movies"
      :key="movie.id"
      class="flex flex-col overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg"
    >
      <!-- Poster -->
      <div class="relative">
        <img
          :src="`${imageBase}${movie.poster_path}`"
          :alt="movie.title"
          class="w-full aspect-2/3 object-cover bg-neutral-800"
        />
        <span
          class="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm"
        >
          {{ type(movie) }}
        </span>
      </div>

      <!-- Info -->
      <div class="p-3">
        <h3 class="text-sm font-bold text-white leading-tight line-clamp-1">{{ movie.title }}</h3>

        <div class="mt-1.5 flex items-center gap-3 text-xs text-neutral-400">
          <span>{{ movie.release_date.slice(0, 4) }}</span>
          <span class="flex items-center gap-0.5">
            <UIcon name="i-heroicons-star-solid" class="size-3 text-yellow-400" />
            {{ movie.vote_average.toFixed(1) }}
          </span>
        </div>

        <div class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="gender in movie.genres"
            :key="gender.id"
            class="rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-200"
          >
            {{ gender.name }}
          </span>
        </div>
      </div>
    </article>
  </div>
</template>
