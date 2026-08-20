<script setup>
import * as v from 'valibot'
import { passwordField } from '../../utils/schemas.js'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore.js'
import PasswordInput from '../base/inputs/PasswordInput.vue'
import AuthButton from '../base/buttons/AuthButton.vue'
import AuthBackground from '../AuthBackground.vue'
import { useNotify } from '../../composables/useNotify'

const { success, error } = useNotify()
const router = useRouter()
const userStore = useUserStore()

const schema = v.object({
  password: passwordField,
  repeatPassword: v.pipe(
    v.string(),
    v.custom((val) => val === resetData.password, 'Las contraseñas no coinciden'),
  ),
})

const resetData = reactive({
  password: '',
  repeatPassword: '',
})

onMounted(() => {
  if (!userStore.recoverySession) {
    error('El enlace no es válido o venció', 'Pedí un nuevo correo de recuperación')
    router.push('/auth')
  }
})

async function updatePasswordButton() {
  try {
    await userStore.setNewPassword(resetData.password)
    success('Contraseña actualizada', 'Ya podés usar tu nueva contraseña')
    router.push('/')
  } catch (e) {
    error('No se pudo actualizar la contraseña', e.message)
  }
}
</script>

<template>
  <AuthBackground>
    <div
      class="relative z-10 w-[384px] h-auto bg-elevated border border-default rounded-2xl p-8 flex flex-col gap-4"
    >
      <div class="flex flex-col gap-1">
        <h1 class="font-bold text-2xl text-center">Nueva contraseña</h1>
        <p class="text-center text-muted text-sm">Elegí una contraseña nueva para tu cuenta</p>
      </div>
      <UForm class="flex flex-col gap-3" :state="resetData" :schema="schema">
        <PasswordInput v-model="resetData.password" label="Nueva contraseña" />
        <PasswordInput
          v-model="resetData.repeatPassword"
          name="repeatPassword"
          label="Confirmar contraseña"
        />
        <div class="flex flex-col gap-2 mt-2">
          <AuthButton label="Guardar contraseña" @click="updatePasswordButton" />
        </div>
      </UForm>
    </div>
  </AuthBackground>
</template>
