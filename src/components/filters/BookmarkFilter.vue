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
    default: 'bookmark',
  },
})

const movieStore = useMovieStore()
const isBookmark = computed(() => movieStore.bookmarkIds.has(props.movieId))

async function bookmarkStatus() {
  isBookmark.value
    ? await movieStore.deleteActionToMovie(props.movieId, props.actionName)
    : await movieStore.addActionToMovie(props.movieId, props.actionName)
}
</script>

<template>
  <button
    :class="
      isBookmark ? 'bg-green-400/30 text-green-800' : 'bg-black/60 text-white hover:text-green-400'
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
