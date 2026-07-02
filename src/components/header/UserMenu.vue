<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()
const router = useRouter()

async function logout() {
  try {
    await userStore.logout()
    router.push('/auth')
  } catch (error) {
    console.log(error)
  }
}

const userMenuItems = [
  [
    {
      label: userStore.user.username,
      slot: 'account',
      disabled: true,
    },
  ],
  [{ label: 'Mi perfil', icon: 'i-heroicons-user' }],
  [
    {
      label: 'Cerrar sesión',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      color: 'error',
      onSelect: logout,
    },
  ],
]
</script>

<template>
  <UDropdownMenu :items="userMenuItems">
    <div class="flex items-center gap-2 cursor-pointer">
      <UAvatar size="sm" :alt="userStore.user.username" class="bg-green-500/15" />
      <span class="text-white text-sm font-medium">{{ userStore.user.username }}</span>
    </div>

    <template #account>
      <div class="flex flex-col px-1 py-0.5">
        <span class="text-xs text-neutral-400">{{ userStore.user.email }}</span>
      </div>
    </template>
  </UDropdownMenu>
</template>
