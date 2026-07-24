<script setup>
import FavoriteFilter from '../filters/FavoriteFilter.vue'
import BookmarkFilter from '../filters/BookmarkFilter.vue'
import WatchedFilter from '../filters/WatchedFilter.vue'

const props = defineProps({
  movie: {
    type: Object,
    default: null,
  },
})

const imageBase = 'https://image.tmdb.org/t/p/original'

function contentType(movie) {
  return movie.type === 'movie' ? 'Película' : 'Serie'
}
</script>

<template>
  <UModal scrollable :ui="{ overlay: 'z-[100]', content: 'z-[100] max-w-xl' }">
    <button class="boton-detalles">
      <UIcon name="i-heroicons-play-solid" class="size-3.5" />
      Ver detalles
    </button>

    <template #content="{ close }">
      <div class="modal-detalle">
        <div
          class="modal-backdrop"
          :style="{ backgroundImage: `url(${imageBase}${props.movie.backdrop_path})` }"
        >
          <div class="modal-backdrop-overlay" />

          <button class="boton-cerrar" @click="close">
            <UIcon name="i-heroicons-x-mark" class="size-4" />
          </button>

          <div class="modal-poster-wrapper">
            <img
              :src="`${imageBase}${props.movie.poster_path}`"
              :alt="props.movie.title"
              class="modal-poster"
            />
          </div>
        </div>

        <div class="modal-cuerpo">
          <div class="modal-header">
            <div>
              <span class="badge-tipo-modal">{{ contentType(props.movie) }}</span>
              <h2 class="modal-titulo">{{ props.movie.title }}</h2>
            </div>

            <div class="modal-acciones">
              <FavoriteFilter :movieId="props.movie.id" />
              <BookmarkFilter :movieId="props.movie.id" />
              <WatchedFilter :movieId="props.movie.id" />
            </div>
          </div>

          <div class="modal-meta">
            <span>
              <UIcon name="i-heroicons-calendar-days" class="size-3.5" />
              {{ props.movie.release_date?.slice(0, 4) }}
            </span>
            <span>
              <UIcon name="i-heroicons-star-solid" class="size-3.5 text-yellow-400" />
              {{ props.movie.vote_average?.toFixed(1) }}
            </span>
          </div>

          <div class="modal-generos">
            <span v-for="genre in props.movie.genres" :key="genre.id" class="badge-genero-modal">
              {{ genre.name }}
            </span>
          </div>

          <hr class="modal-divisor" />

          <h3 class="modal-subtitulo">Sinopsis</h3>
          <p class="modal-sinopsis">{{ props.movie.overview }}</p>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style>
@reference "tailwindcss";

.boton-detalles {
  @apply pointer-events-auto flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-3 py-1.5 rounded-full transition-colors;
}

.modal-detalle {
  @apply flex flex-col;
}

.modal-backdrop {
  @apply relative h-72 bg-cover bg-center bg-neutral-800 rounded-t-lg;
}

.modal-backdrop-overlay {
  @apply absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-900/10 to-black/30;
}

.boton-cerrar {
  @apply absolute top-3 right-3 z-10 flex items-center justify-center size-8 rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors;
}

.modal-poster-wrapper {
  @apply absolute -bottom-14 left-6 z-10;
}

.modal-poster {
  @apply w-24 h-36 object-cover rounded-lg ring-2 ring-neutral-900 shadow-lg bg-neutral-800;
}

.modal-cuerpo {
  @apply bg-neutral-900 pt-16 px-6 pb-6 rounded-b-lg;
}

.modal-header {
  @apply flex items-center justify-between gap-4;
}

.badge-tipo-modal {
  @apply inline-block rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-semibold text-neutral-300 mb-2;
}

.modal-titulo {
  @apply text-2xl font-bold text-white;
}

.modal-acciones {
  @apply flex items-center gap-2 shrink-0;
}

.boton-marcar-vista {
  @apply flex items-center gap-1.5 rounded-full border border-neutral-700 px-3.5 py-2 text-sm font-medium text-white hover:border-neutral-500 transition-colors;
}

.modal-meta {
  @apply mt-4 flex items-center gap-4 text-sm text-neutral-400;
}

.modal-meta span {
  @apply flex items-center gap-1.5;
}

.modal-generos {
  @apply mt-3 flex flex-wrap gap-1.5;
}

.badge-genero-modal {
  @apply rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-200;
}

.modal-divisor {
  @apply my-5 border-neutral-800;
}

.modal-subtitulo {
  @apply text-base font-semibold text-white mb-2;
}

.modal-sinopsis {
  @apply text-sm leading-relaxed text-neutral-300;
}
</style>
