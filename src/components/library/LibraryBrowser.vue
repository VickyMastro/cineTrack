<script setup>
import LibraryList from './LibraryList.vue'
</script>

<template>
  <section class="px-6 py-6">
    <div
      class="flex items-center gap-3 rounded-xl border border-default bg-elevated p-4 dark:rounded-none dark:border-transparent dark:bg-transparent dark:p-0"
    >
      <div class="w-9 h-9 bg-green-500/15 rounded-lg flex items-center justify-center shrink-0">
        <UIcon name="i-heroicons-chart-bar" class="text-green-400 size-5" />
      </div>
      <div>
        <h1 class="text-highlighted font-bold text-xl leading-tight">Mi Biblioteca</h1>
        <p class="text-muted text-sm">Tu colección personal de películas y series</p>
      </div>
    </div>
  </section>
  <LibraryList />
</template>
