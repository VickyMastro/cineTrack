<script setup>
import * as v from 'valibot'
import { emailField, passwordField } from '../utils/schemas.js'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore.js'
import EmailInput from './base/inputs/EmailInput.vue'
import PasswordInput from './base/inputs/PasswordInput.vue'
import AuthButton from './base/buttons/AuthButton.vue'
import AuthLink from './base/links/AuthLink.vue'

const userStore = useUserStore()
const router = useRouter()

const schema = v.object({
  email: emailField,
  password: passwordField,
})

const loginData = reactive({
  email: '',
  password: '',
})

async function loginButton() {
  try {
    await userStore.login(loginData.email, loginData.password)
    router.push('/')
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div
    class="relative z-10 w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-8 flex flex-col gap-4 min-h-[460px]"
  >
    <h1 class="font-bold text-2xl text-center">Bienvenido</h1>
    <p class="text-center text-neutral-400 text-sm">Inicia sesión para continuar viendo</p>
    <UForm class="flex flex-col" :state="loginData" :schema="schema">
      <EmailInput v-model="loginData.email" />
      <PasswordInput v-model="loginData.password" />
      <div class="flex justify-end text-sm p-2">
        <AuthLink title="Olvide mi contraseña" />
      </div>
      <AuthButton label="Iniciar sesión" @click="loginButton" />
      <div class="flex justify-center text-sm pt-5">
        <span class="mr-1">¿No tienes cuenta?</span>
        <AuthLink title="Registrate" to="/registration" />
      </div>
    </UForm>
  </div>
</template>
