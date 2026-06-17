<script setup>
const props = defineProps({
  to: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <ULink class="text-primary hover:text-primary/50 font-medium" :to="props.to">
    {{ props.title }}
  </ULink>
</template>
