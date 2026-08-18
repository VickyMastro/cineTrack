<script setup>
import { computed } from 'vue'
import { useMovieStore } from '../../stores/movieStore'
import { useNotify } from '../../composables/useNotify.js'

const { error } = useNotify()

const props = defineProps({
  movieId: {
    type: Number,
    default: null,
  },
  actionName: {
    type: String,
    default: 'watched',
  },
})

const movieStore = useMovieStore()
const isWatched = computed(() => movieStore.watchedIds.has(props.movieId))

async function watchedStatus() {
  try {
    isWatched.value
      ? await movieStore.deleteActionToMovie(props.movieId, props.actionName)
      : await movieStore.addActionToMovie(props.movieId, props.actionName)
  } catch (e) {
    error('Ocurrio un error.', e.message)
  }
}
</script>

<template>
  <button
    :class="
      isWatched ? 'bg-blue-800/30 text-blue-500' : 'bg-black/60 text-white hover:text-blue-400'
    "
    class="p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-blue-400 transition-colors;"
    @click="watchedStatus"
  >
    <UIcon :name="isWatched ? 'i-heroicons-eye-solid' : 'i-heroicons-eye'" class="size-4" />
  </button>
</template>
