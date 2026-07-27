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
@reference "tailwindcss";

.item-biblioteca {
  @apply flex items-center gap-1.5 text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-200;
}

.item-biblioteca--activo {
  @apply text-white font-semibold;
}

.contador-biblioteca {
  @apply flex items-center justify-center rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-400;
}

.contador-biblioteca--activo {
  @apply text-white font-semibold;
}
</style>
