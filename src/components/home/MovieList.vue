<script setup>
import { useMovieStore } from '../../stores/movieStore'
import FavoriteFilter from '../filters/FavoriteFilter.vue'
import BookmarkFilter from '../filters/BookmarkFilter.vue'

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
  <div class="resultados-contador">{{ movieStore.movies.length }} Resultados</div>
  <div class="grid-peliculas">
    <article v-for="movie in movieStore.movies" :key="movie.id" class="tarjeta group">
      <!-- Poster -->
      <div class="tarjeta-poster">
        <img :src="`${imageBase}${movie.poster_path}`" :alt="movie.title" class="poster-img" />

        <!-- Overlay oscuro al hover -->
        <div class="overlay-hover" />

        <span class="badge-tipo">
          {{ type(movie) }}
        </span>

        <div class="acciones-overlay">
          <FavoriteFilter :movieId="movie.id" />
          <BookmarkFilter :movieId="movie.id" />
          <button class="boton-ojo">
            <UIcon name="i-heroicons-eye" class="size-4" />
          </button>
        </div>

        <!-- Botón Ver detalles centrado vertical y horizontal -->
        <div class="boton-detalles-wrapper">
          <button class="boton-detalles">
            <UIcon name="i-heroicons-play-solid" class="size-3.5" />
            Ver detalles
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="tarjeta-info">
        <h3 class="titulo">{{ movie.title }}</h3>

        <div class="meta">
          <span>{{ movie.release_date.slice(0, 4) }}</span>
          <span class="rating">
            <UIcon name="i-heroicons-star-solid" class="size-3 text-yellow-400" />
            {{ movie.vote_average.toFixed(1) }}
          </span>
        </div>

        <div class="generos">
          <span v-for="gender in movie.genres" :key="gender.id" class="badge-genero">
            {{ gender.name }}
          </span>
        </div>
      </div>
    </article>
  </div>
</template>

<style>
@reference "tailwindcss";

.resultados-contador {
  @apply px-6 pt-2;
}

.grid-peliculas {
  @apply grid grid-cols-5 gap-4 p-6;
}

.tarjeta {
  @apply flex flex-col overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg cursor-pointer transition-colors duration-200 hover:border-green-500;
}

.tarjeta-poster {
  @apply relative;
}

.poster-img {
  @apply w-full aspect-2/3 object-cover bg-neutral-800 transition-transform duration-300 group-hover:scale-105;
}

.overlay-hover {
  @apply absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200;
}

.badge-tipo {
  @apply absolute top-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm z-10;
}

.acciones-overlay {
  @apply absolute top-2 right-2 flex flex-col gap-1.5;
}

.boton-ojo {
  @apply p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white hover:text-white/70 transition-colors;
}

.boton-detalles-wrapper {
  @apply absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none;
}

.boton-detalles {
  @apply pointer-events-auto flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-3 py-1.5 rounded-full transition-colors;
}

.tarjeta-info {
  @apply p-3;
}

.titulo {
  @apply text-sm font-bold text-white leading-tight line-clamp-1;
}

.meta {
  @apply mt-1.5 flex items-center gap-3 text-xs text-neutral-400;
}

.rating {
  @apply flex items-center gap-0.5;
}

.generos {
  @apply mt-2 flex flex-wrap gap-1;
}

.badge-genero {
  @apply rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-200;
}
</style>
