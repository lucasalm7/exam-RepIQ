<script setup>
defineProps({
  text: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 space-y-3">
    <!-- Animated Spinner -->
    <div class="relative w-10 h-10">
      <div class="absolute inset-0 rounded-full border-4 border-primary/20"></div>
      <div class="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
    <!-- Optional Loading Text -->
    <p v-if="text" class="text-xs font-medium text-zinc-400 tracking-wide animate-pulse">
      {{ text }}
    </p>
  </div>
</template>