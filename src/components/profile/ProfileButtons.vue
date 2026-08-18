<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useNotify } from '../../composables/useNotify.js'

const { success, error } = useNotify()

const router = useRouter()
const userStore = useUserStore()

const isDeleting = ref(false)

async function confirmDeleteAccount(close) {
  isDeleting.value = true

  try {
    await userStore.deleteAccount()
    close()
    success('Cuenta eliminada', 'Tu cuenta se dio de baja correctamente.')
    router.push('/auth')
  } catch (e) {
    error('No se pudo eliminar la cuenta', e.message)
  } finally {
    isDeleting.value = false
  }
}

async function closeSession() {
  try {
    await userStore.logout()
  } catch (e) {
    error('Ocurrio un error.', e.message)
  }
  router.push('/auth')
}
</script>
<template>
  <div class="col-span-1 flex flex-col justify-center gap-3">
    <UButton
      label="Cerrar sesión"
      icon="i-heroicons-arrow-right-on-rectangle"
      color="neutral"
      variant="soft"
      block
      @click="closeSession"
    />

    <UModal :ui="{ content: 'max-w-md' }">
      <UButton
        label="Dar de baja la cuenta"
        icon="i-heroicons-trash"
        color="error"
        variant="soft"
        block
      />

      <template #content="{ close }">
        <div class="modal-baja">
          <div class="icono-alerta">
            <UIcon name="i-heroicons-exclamation-triangle" class="size-6" />
          </div>

          <h3 class="titulo-baja">¿Eliminar tu cuenta?</h3>
          <p class="texto-baja">
            Esta acción es permanente y no se puede deshacer. Vas a perder tu perfil, tus favoritos,
            tu lista de seguimiento y todo el contenido marcado como visto.
          </p>

          <div class="acciones-baja">
            <UButton
              label="Cancelar"
              color="neutral"
              variant="soft"
              block
              :disabled="isDeleting"
              @click="close"
            />
            <UButton
              label="Sí, eliminar mi cuenta"
              color="error"
              variant="solid"
              block
              :loading="isDeleting"
              @click="confirmDeleteAccount(close)"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.modal-baja {
  @apply flex flex-col gap-3 rounded-lg bg-neutral-900 p-6;
}

.icono-alerta {
  @apply flex size-10 items-center justify-center rounded-full bg-red-500/15 text-red-400;
}

.titulo-baja {
  @apply text-lg font-bold text-white;
}

.texto-baja {
  @apply text-sm text-neutral-400;
}

.acciones-baja {
  @apply mt-2 grid grid-cols-2 gap-3;
}
</style>
