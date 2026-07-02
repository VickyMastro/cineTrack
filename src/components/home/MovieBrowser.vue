<script setup lang="ts">
import MovieList from './MovieList.vue'
import SearchBar from './SearchBar.vue'
</script>

<template>
  <section class="px-6 py-6">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 bg-green-500/15 rounded-lg flex items-center justify-center shrink-0">
        <UIcon name="i-heroicons-sparkles" class="text-green-400 size-5" />
      </div>
      <div>
        <h1 class="text-white font-bold text-xl leading-tight">Descubrir</h1>
        <p class="text-neutral-400 text-sm">Explora películas y series populares</p>
      </div>
    </div>
  </section>
  <SearchBar />
  <MovieList />
</template>
