<script setup>
const props = defineProps({
  label: {
    type: String,
    default: 'Nombre completo',
  },
  placeholder: {
    type: String,
    default: 'Tu nombre',
  },
})

const name = defineModel({ default: '' })
</script>

<template>
  <UFormField name="name" :label="props.label" class="w-full min-h-76px">
    <UInput
      v-model="name"
      :placeholder="props.placeholder"
      class="w-full"
      :ui="{ base: 'focus-visible:ring-accented ' }"
    />
  </UFormField>
</template>
