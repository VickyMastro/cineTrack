<script setup>
import { computed } from 'vue'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()

const formattedDate = computed(() => {
  const formatted = new Date(userStore.user.created).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  })

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
})
</script>

<template>
  <section class="px-6 pt-6">
    <div class="tarjeta-perfil">
      <UAvatar
        :alt="userStore.user.username"
        class="size-20 text-3xl ring-2 ring-neutral-800 shrink-0"
      />
      <div class="flex flex-col gap-3">
        <div>
          <h2 class="text-white font-bold text-3xl leading-tight">{{ userStore.user.username }}</h2>
          <p class="text-neutral-400 text-sm">{{ userStore.user.email }}</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="badge-info">
            <UIcon name="i-heroicons-calendar-days" class="size-3.5" />
            Miembro desde {{ formattedDate }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.tarjeta-perfil {
  @apply flex items-center gap-5 p-6 rounded-xl border border-neutral-800 bg-linear-to-r from-green-500/10 via-neutral-900 to-neutral-900;
}

.badge-info {
  @apply inline-flex items-center gap-1.5 rounded-full bg-green-800 px-3 py-1 text-xs font-medium text-green-300;
}
</style>
