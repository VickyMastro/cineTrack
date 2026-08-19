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
      <p class="text-muted text-xs">{{ props.label }}</p>
      <p class="text-highlighted font-bold text-2xl leading-tight">{{ props.value }}</p>
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.tarjeta-stat {
  @apply flex items-center gap-3 rounded-xl border border-default bg-elevated p-4;
}

.icono-stat {
  @apply w-10 h-10 rounded-full flex items-center justify-center shrink-0;
}
</style>
