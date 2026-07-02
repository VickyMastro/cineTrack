<script setup>
const props = defineProps({
  to: {
    type: String,
    default: '/',
  },
  name: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>
<template>
  <RouterLink :to="props.to" custom v-slot="{ isActive }">
    <button
      :class="[
        'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors',
        isActive ? 'bg-green-500/15 text-green-400' : 'text-neutral-400 hover:text-neutral-200',
      ]"
    >
      <UIcon :name="props.icon" class="size-4" />
      {{ props.name }}
    </button>
  </RouterLink>
</template>
