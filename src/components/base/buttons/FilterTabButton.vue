<script setup>
import { computed } from 'vue'
import { useMovieStore } from '../../../stores/movieStore'

const movieStore = useMovieStore()

const props = defineProps({
  title: {
    type: String,
    default: 'Boton de filtro',
  },
  icon: {
    type: String,
    default: '',
  },
  colorIcon: {
    type: String,
    default: 'text-green-400',
  },
  filter: {
    type: String,
    default: '',
  },
  countValue: {
    type: Number,
    default: 0,
  },
})

const isActive = computed(() => movieStore.libraryFilter === props.filter)

function setLibraryFilter() {
  movieStore.libraryFilter = props.filter
}
</script>

<template>
  <button
    type="button"
    class="item-biblioteca"
    :class="{ 'item-biblioteca--activo': isActive }"
    @click="setLibraryFilter"
  >
    <UIcon :name="props.icon" class="size-4" :class="props.colorIcon" />
    {{ props.title }}
    <span class="contador-biblioteca" :class="{ 'contador-biblioteca--activo': isActive }">
      {{ props.countValue }}
    </span>
  </button>
</template>

<style>
@reference "../../../assets/css/main.css";

.item-biblioteca {
  @apply flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-muted transition-colors hover:text-highlighted hover:bg-accented/60;
}

.item-biblioteca--activo {
  @apply bg-green-500/15 text-highlighted font-semibold hover:bg-green-500/15;
}

.contador-biblioteca {
  @apply flex items-center justify-center rounded-full bg-accented px-2 py-0.5 text-xs font-medium text-muted;
}

.contador-biblioteca--activo {
  @apply text-highlighted font-semibold;
}
</style>
