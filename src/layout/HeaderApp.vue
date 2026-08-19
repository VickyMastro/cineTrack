<script setup>
import NavLink from '../components/header/NavLink.vue'
import UserMenu from '../components/header/UserMenu.vue'
</script>

<template>
  <header class="border-b border-default bg-elevated dark:bg-default h-14 flex items-center px-6">
    <div class="flex items-center justify-between w-full">
      <RouterLink class="flex items-center gap-2 cursor-pointer" to="/">
        <div class="w-7 h-7 bg-green-500/15 rounded-md flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-film" class="text-highlighted size-4" />
        </div>
        <span class="text-highlighted font-bold text-base tracking-wide">CineTrack</span>
      </RouterLink>

      <nav class="flex items-center gap-1">
        <NavLink name="Descubrir" icon="i-heroicons-magnifying-glass" />
        <NavLink to="/library" name="Mi Biblioteca" icon="i-heroicons-chart-bar" />
        <NavLink to="/stats" name="Estadísticas" icon="i-heroicons-chart-bar-square" />
      </nav>

      <div class="flex items-center gap-2">
        <UserMenu />
        <UColorModeButton
          :ui="{
            base: 'hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent active:bg-transparent',
          }"
        />
      </div>
    </div>
  </header>
</template>
