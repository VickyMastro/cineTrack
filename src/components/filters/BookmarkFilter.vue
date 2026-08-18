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
    default: 'bookmark',
  },
})

const movieStore = useMovieStore()
const isBookmark = computed(() => movieStore.bookmarkIds.has(props.movieId))

async function bookmarkStatus() {
  try {
    isBookmark.value
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
      isBookmark ? 'bg-green-800/30 text-green-500' : 'bg-black/60 text-white hover:text-green-400'
    "
    class="p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-green-400 transition-colors;"
    @click="bookmarkStatus"
  >
    <UIcon
      :name="isBookmark ? 'i-heroicons-bookmark-solid' : 'i-heroicons-bookmark'"
      class="size-4"
    />
  </button>
</template>
