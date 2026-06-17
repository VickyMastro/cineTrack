<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['click'])
</script>

<template>
  <UButton
    :label="props.label"
    class="justify-center font-bold rounded-full"
    color="primary"
    variant="solid"
    size="lg"
    @click="emit('click')"
  />
</template>
