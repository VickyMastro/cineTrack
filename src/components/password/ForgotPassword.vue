<script setup>
import * as v from 'valibot'
import { emailField } from '../../utils/schemas.js'
import { reactive } from 'vue'
import { useUserStore } from '../../stores/userStore.js'
import EmailInput from '../base/inputs/EmailInput.vue'
import AuthButton from '../base/buttons/AuthButton.vue'
import { useNotify } from '../../composables/useNotify'

const { success, error } = useNotify()

const userStore = useUserStore()

const schema = v.object({
  email: emailField,
})

const recoverData = reactive({
  email: '',
})

async function recoverPasswordButton(close) {
  try {
    await userStore.recoveryPasswordEmail(recoverData.email)
    recoverData.email = ''
    close()
    success('Se envio el pedido correctamente', 'Revisa tu correo electrónico')
  } catch (e) {
    error('No se pudo enviar el pedido', e.message)
  }
}
</script>

<template>
  <UModal
    :ui="{
      overlay: 'z-[100] bg-black/70',
      content: 'z-[100] w-[480px] max-w-[480px] p-0 bg-transparent ring-0 shadow-none divide-y-0',
    }"
  >
    <ULink class="text-primary hover:text-primary/50 font-medium">Olvide mi contraseña</ULink>

    <template #content="{ close }">
      <div class="w-480px bg-elevated border border-default rounded-2xl p-10 flex flex-col gap-5">
        <div class="flex flex-col gap-1">
          <h1 class="font-bold text-2xl text-center">Recuperar contraseña</h1>
          <p class="text-center text-muted text-sm">
            Escribe tu mail para restablecer tu contraseña
          </p>
        </div>
        <UForm class="flex flex-col gap-5" :state="recoverData" :schema="schema">
          <EmailInput v-model="recoverData.email" />
          <AuthButton class="mt-1" label="Recuperar" @click="recoverPasswordButton(close)" />
        </UForm>
      </div>
    </template>
  </UModal>
</template>
