<script setup>
const props = defineProps({
  label: {
    type: String,
    default: 'Correo electrónico',
  },
  placeholder: {
    type: String,
    default: 'tu@email.com',
  },
})

const email = defineModel({ default: '' })
</script>

<template>
  <UFormField name="email" :label="props.label" class="w-full">
    <UInput
      v-model="email"
      icon="i-heroicons-envelope"
      :placeholder="props.placeholder"
      class="w-full"
      :ui="{ base: 'focus-visible:ring-accented ' }"
    />
  </UFormField>
</template>
