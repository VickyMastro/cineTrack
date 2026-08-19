<script setup>
import FilterTabButton from '../base/buttons/FilterTabButton.vue'
import DetailMovieModal from '../home/DetailMovieModal.vue'
import NoResultsView from '../../views/NoResultsView.vue'
import { computed } from 'vue'
import { useMovieStore } from '../../stores/movieStore.js'

const movieStore = useMovieStore()
const imageBase = 'https://image.tmdb.org/t/p/original'

const showEmptyLibrary = computed(
  () => movieStore.movies.length > 0 && movieStore.libraryMovieList.length === 0,
)

const emptyCopy = computed(() => {
  if (movieStore.libraryFilter === 'bookmark') {
    return {
      icon: 'i-heroicons-bookmark',
      iconClass: 'text-green-400',
      title: 'Todavía no hay pendientes',
      description: 'Guardá películas y series para ver más tarde y van a aparecer acá.',
    }
  }

  if (movieStore.libraryFilter === 'favorite') {
    return {
      icon: 'i-heroicons-heart',
      iconClass: 'text-red-400',
      title: 'Todavía no hay favoritas',
      description: 'Marcá películas y series con el corazón para armar tu colección.',
    }
  }

  return {
    icon: 'i-heroicons-eye',
    iconClass: 'text-blue-400',
    title: 'Todavía no hay contenido visto',
    description: 'Explorá el catálogo y marcalas como vistas para verlas acá.',
  }
})
</script>

<template>
  <nav class="lista-biblioteca">
    <FilterTabButton
      title="Vistas"
      icon="i-heroicons-eye"
      filter="watched"
      :count-value="movieStore.watchedIds.size"
      color-icon="text-blue-800"
    />
    <FilterTabButton
      title="Pendientes"
      icon="i-heroicons-bookmark"
      filter="bookmark"
      :count-value="movieStore.bookmarkIds.size"
    />
    <FilterTabButton
      title="Favoritas"
      icon="i-heroicons-heart"
      filter="favorite"
      :count-value="movieStore.favoriteIds.size"
      color-icon="text-red-400"
    />
  </nav>

  <NoResultsView
    v-if="showEmptyLibrary"
    :icon="emptyCopy.icon"
    :icon-class="emptyCopy.iconClass"
    :title="emptyCopy.title"
    :description="emptyCopy.description"
  />
  <div v-else class="lista-peliculas">
    <article
      v-for="movie in movieStore.libraryMovieList"
      :key="movie.id"
      class="fila-pelicula group"
    >
      <!-- Poster -->
      <div class="fila-poster">
        <DetailMovieModal :movie="movie">
          <img
            :src="`${imageBase}${movie.poster_path}`"
            :alt="movie.title"
            class="fila-poster-img cursor-pointer"
          />
        </DetailMovieModal>

        <!-- Overlay oscuro al hover -->
        <div class="overlay-hover" />
      </div>

      <!-- Info -->
      <div class="fila-info">
        <h3 class="titulo">{{ movie.title }}</h3>

        <div class="meta">
          <span>{{ movie.release_date.slice(0, 4) }}</span>
          <span class="rating">
            <UIcon name="i-heroicons-star-solid" class="size-3.5 text-yellow-400" />
            {{ movie.vote_average.toFixed(1) }}
          </span>
        </div>

        <div class="generos">
          <span v-for="genre in movie.genres" :key="genre.id" class="badge-genero">
            {{ genre.name }}
          </span>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.lista-biblioteca {
  @apply flex w-fit mx-auto items-center gap-1 rounded-xl border border-default bg-elevated p-1 my-4;
}

.lista-peliculas {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6 dark:gap-x-12 dark:gap-y-0 dark:pb-0;
}

.fila-pelicula {
  @apply flex items-center gap-5 rounded-xl border border-default bg-elevated p-4 dark:rounded-none dark:border-x-0 dark:border-t-0 dark:bg-transparent dark:p-0 dark:py-6;
}

.fila-poster {
  @apply relative w-28 shrink-0 overflow-hidden rounded-lg;
}

.fila-poster-img {
  @apply w-full aspect-2/3 object-cover bg-muted;
}

.overlay-hover {
  @apply absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none;
}

.fila-info {
  @apply min-w-0;
}

.titulo {
  @apply text-base font-bold text-highlighted leading-tight line-clamp-1;
}

.meta {
  @apply mt-2 flex items-center gap-3 text-sm text-muted;
}

.badge-tipo-lista {
  @apply rounded-full bg-accented px-2.5 py-1 text-xs font-semibold text-highlighted;
}

.rating {
  @apply flex items-center gap-1;
}

.generos {
  @apply mt-3 flex flex-wrap gap-1.5;
}

.badge-genero {
  @apply rounded-full bg-accented px-2.5 py-1 text-xs font-medium text-toned;
}
</style>
