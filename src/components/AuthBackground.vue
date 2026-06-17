<template>
  <div
    class="min-h-screen bg-cover bg-center flex items-center justify-center"
    style="
      background-image: url('https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg');
    "
  >
    <div class="absolute inset-0 bg-black/70"></div>
    <div class="relative z-10 flex flex-col items-center gap-6 mb-2">
      <div class="flex items-center gap-3">
        <div class="bg-primary rounded-xl p-2">
          <UIcon name="i-heroicons-film" class="size-7 text-white" />
        </div>
        <span class="text-2xl font-bold text-white tracking-wide">CineTrack</span>
      </div>
      <slot />
    </div>
  </div>
</template>
