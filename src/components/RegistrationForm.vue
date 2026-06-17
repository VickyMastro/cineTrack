<script setup>
import * as v from 'valibot'
import { emailField, passwordField, usernameField } from '../utils/schemas.js'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore.js'
import NameInput from './base/inputs/NameInput.vue'
import EmailInput from './base/inputs/EmailInput.vue'
import PasswordInput from './base/inputs/PasswordInput.vue'
import AuthButton from './base/buttons/AuthButton.vue'
import AuthLink from './base/links/AuthLink.vue'

const userStore = useUserStore()
const router = useRouter()

const schema = v.object({
  name: usernameField,
  email: emailField,
  password: passwordField,
  repeatPassword: v.pipe(
    v.string(),
    v.custom((val) => val === registerData.password, 'Las contraseñas no coinciden'),
  ),
})

const registerData = reactive({
  name: '',
  email: '',
  password: '',
  repeatPassword: '',
})

async function registerButton() {
  try {
    await userStore.registerUser(registerData.name, registerData.email, registerData.password)
    router.push('/')
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div
    class="relative z-10 w-[384px] h-auto bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col gap-2"
  >
    <h1 class="font-bold text-2xl text-center">Crear cuenta</h1>
    <p class="text-center text-neutral-400 text-sm">
      Registrate para guardar tu contenido favorito
    </p>
    <UForm class="flex flex-col" :state="registerData" :schema="schema">
      <NameInput v-model="registerData.name" />
      <EmailInput v-model="registerData.email" />
      <PasswordInput v-model="registerData.password" />
      <PasswordInput
        v-model="registerData.repeatPassword"
        name="repeatPassword"
        label="Confirmar contraseña"
      />

      <AuthButton label="Crear cuenta" @click="registerButton" />
      <div class="flex justify-center text-sm pt-3">
        <span class="mr-1">¿Ya tienes cuenta?</span>
        <AuthLink title="Inicia sesión" to="/auth" />
      </div>
    </UForm>
  </div>
</template>
