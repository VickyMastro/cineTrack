<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Contraseña',
  },
  placeholder: {
    type: String,
    default: '********',
  },
  name: {
    type: String,
    default: 'password',
  },
})

const password = defineModel({ default: '' })
const show = ref(false)
</script>

<template>
  <UFormField :name="props.name" :label="props.label" class="w-full">
    <UInput
      v-model="password"
      :type="show ? 'text' : 'password'"
      icon="i-heroicons-lock-closed"
      class="w-full"
      :placeholder="props.placeholder"
      :ui="{ base: 'focus-visible:ring-accented ' }"
    >
      <template #trailing>
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          :aria-label="show ? 'Esconder contraseña' : 'Mostrar contraseña'"
          :aria-pressed="show"
          aria-controls="password"
          @click="show = !show"
        />
      </template>
    </UInput>
  </UFormField>
</template>
