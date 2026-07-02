<script setup>
import { ref } from 'vue'

const showFilters = ref(true)

const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const type = ref('Todos')
const gender = ref('Todos')
const year = ref('Todos')
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <div class="flex items-center gap-3 w-full max-w-3xl">
      <UInput
        icon="i-heroicons-magnifying-glass"
        size="md"
        variant="outline"
        placeholder="Buscar películas o series..."
        class="flex-1"
      />
      <UButton
        color="neutral"
        variant="outline"
        icon="i-heroicons-adjustments-horizontal"
        @click="showFilters = !showFilters"
      >
        Filtros
      </UButton>
    </div>
    <!-- filtros -->
    <div
      v-if="showFilters"
      class="w-full max-w-3xl border border-neutral-800 rounded-xl p-4 flex flex-col gap-3"
    >
      <div class="flex justify-end">
        <button
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          <UIcon name="i-heroicons-x-mark" class="text-green-400 size-5" />
          Limpiar Filtro
        </button>
      </div>
      <div class="flex items-center justify-between gap-6">
        <div>
          <span class="p-4 text-neutral-400 text-xs">Tipo</span>
          <USelect v-model="type" :items="items" class="w-40" />
        </div>
        <div>
          <span class="p-4 text-neutral-400 text-xs">Género</span>
          <USelect v-model="gender" :items="items" class="w-40" />
        </div>
        <div>
          <span class="p-4 text-neutral-400 text-xs">Año</span>
          <USelect v-model="year" :items="items" class="w-40" />
        </div>
      </div>
    </div>
  </div>
</template>
