<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../stores/userStore'

const userStore = useUserStore()
let username = userStore.user.username
const isEditing = ref(false)

async function editButton() {
  isEditing.value = !isEditing.value
  if (username != userStore.user.username) {
    await userStore.updateUsername(username)
  }
}
</script>

<template>
  <div class="tarjeta-cuenta col-span-3">
    <h2 class="titulo-tarjeta mb-4">Información de la cuenta</h2>
    <div class="flex flex-col gap-4">
      <UFormField label="Nombre de usuario">
        <UInput v-model="username" :disabled="!isEditing" maxlength="20" class="w-full">
          <template #trailing>
            <UButton
              :icon="isEditing ? 'i-heroicons-check' : 'i-heroicons-pencil-square'"
              color="primary"
              variant="link"
              size="sm"
              :padded="false"
              @click="editButton"
            />
          </template>
        </UInput>
      </UFormField>
      <UFormField label="Correo electrónico">
        <UInput v-model="userStore.user.email" disabled class="w-full" />
      </UFormField>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.tarjeta-cuenta {
  @apply rounded-xl border border-neutral-800 bg-neutral-900 p-6;
}

.titulo-tarjeta {
  @apply text-lg font-bold text-white;
}
</style>
