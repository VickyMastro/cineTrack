<script setup>
import NavLink from '../components/header/NavLink.vue'
import UserMenu from '../components/header/UserMenu.vue'
</script>

<template>
  <header class="border-b border-neutral-800 h-14 flex items-center px-6">
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-2 cursor-pointer">
        <div class="w-7 h-7 bg-green-500/15 rounded-md flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-film" class="text-white size-4" />
        </div>
        <span class="text-white font-bold text-base tracking-wide">CineTrack</span>
      </div>

      <nav class="flex items-center gap-1">
        <NavLink name="Descubrir" icon="i-heroicons-magnifying-glass" />
        <NavLink to="/library" name="Mi Biblioteca" icon="i-heroicons-chart-bar" />
        <NavLink to="/stats" name="Estadísticas" icon="i-heroicons-chart-bar-square" />
      </nav>

      <UserMenu />
    </div>
  </header>
</template>
