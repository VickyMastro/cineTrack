<script setup>
const props = defineProps({
  icon: {
    type: String,
  },
  color: {
    type: String,
    default: '',
  },
  label: {
    type: String,
  },
  value: {
    type: [String, Number],
  },
})
</script>

<template>
  <div class="tarjeta-stat">
    <div class="icono-stat" :class="props.color">
      <UIcon :name="props.icon" class="size-5" />
    </div>
    <div>
      <p class="text-neutral-400 text-xs">{{ props.label }}</p>
      <p class="text-white font-bold text-2xl leading-tight">{{ props.value }}</p>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.tarjeta-stat {
  @apply flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4;
}

.icono-stat {
  @apply w-10 h-10 rounded-full flex items-center justify-center shrink-0;
}
</style>
