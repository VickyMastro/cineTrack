<script setup>
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

const registerData = reactive({
  name: '',
  email: '',
  password: '',
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
    class="relative z-10 w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-8 flex flex-col gap-4"
  >
    <h1 class="font-bold text-2xl text-center">Crear cuenta</h1>
    <p class="text-center text-neutral-400 text-sm">
      Registrate para guardar tu contenido favorito
    </p>

    <NameInput v-model="registerData.name" />
    <EmailInput v-model="registerData.email" />
    <PasswordInput v-model="registerData.password" />
    <PasswordInput label="Confirmar contraseña" />

    <AuthButton label="Crear cuenta" @click="registerButton" />
    <div class="flex justify-center text-sm">
      <span class="mr-1">¿Ya tienes cuenta?</span>
      <AuthLink title="Inicia sesión" to="/auth" />
    </div>
  </div>
</template>
