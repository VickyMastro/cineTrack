<script setup>
import { useMovieStore } from '../../stores/movieStore'
import { computed } from 'vue'
const props = defineProps({
  movieId: {
    type: Number,
    default: null,
  },
  actionName: {
    type: String,
    default: 'favorite',
  },
})

const movieStore = useMovieStore()
const isFavorite = computed(() => movieStore.favoriteIds.has(props.movieId))

async function favoriteStatus() {
  isFavorite.value
    ? await movieStore.deleteActionToMovie(props.movieId, props.actionName)
    : await movieStore.addActionToMovie(props.movieId, props.actionName)
}
</script>

<template>
  <button
    :class="isFavorite ? 'bg-red-400/80 text-red-500' : 'bg-black/60 text-white hover:text-red-400'"
    class="p-1.5 rounded-full backdrop-blur-sm transition-colors"
    @click="favoriteStatus"
  >
    <UIcon :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" class="size-4" />
  </button>
</template>
