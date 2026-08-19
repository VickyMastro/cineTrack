<script setup>
defineProps({
  icon: {
    type: String,
    default: 'i-heroicons-magnifying-glass',
  },
  iconClass: {
    type: String,
    default: 'text-green-400',
  },
  title: {
    type: String,
    default: 'No se encontraron resultados',
  },
  description: {
    type: String,
    default:
      'No hay películas ni series que coincidan con los filtros o la búsqueda. Probá con otros criterios o limpiá los filtros.',
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
    <div class="w-16 h-16 bg-green-500/15 rounded-2xl flex items-center justify-center">
      <UIcon :name="icon" class="size-8" :class="iconClass" />
    </div>
    <div class="flex flex-col gap-1.5">
      <h2 class="text-highlighted font-bold text-xl">{{ title }}</h2>
      <p class="text-muted text-sm max-w-md">
        {{ description }}
      </p>
    </div>
  </div>
</template>
