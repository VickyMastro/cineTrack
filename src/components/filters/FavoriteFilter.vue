<script setup>
import { useMovieStore } from '../../stores/movieStore'
import { computed } from 'vue'
const props = defineProps({
  movieId: {
    type: Number,
    default: null,
  },
})

const movieStore = useMovieStore()
const isFavorite = computed(() => movieStore.favoriteIds.has(props.movieId))

async function addFavorite() {
  isFavorite.value
    ? await movieStore.deleteFavoriteMovie(props.movieId)
    : await movieStore.addFavoriteMovie(props.movieId)
}
</script>

<template>
  <button
    :class="isFavorite ? 'bg-red-400/80 text-red-500' : 'bg-black/60 text-white hover:text-red-400'"
    class="p-1.5 rounded-full backdrop-blur-sm transition-colors"
    @click="addFavorite"
  >
    <UIcon :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" class="size-4" />
  </button>
</template>
