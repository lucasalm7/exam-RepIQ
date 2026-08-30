<!-- src/components/common/AppHeader.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Dynamic page title based on current router route name
const pageTitle = computed(() => {
  const name = route.name ? String(route.name) : ''
  return name.charAt(0).toUpperCase() + name.slice(1)
})
</script>

<template>
  <header class="flex justify-between items-center px-6 py-4 border-b border-surface-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
    <div>
      <h1 class="text-xl font-semibold tracking-tight text-white">
        {{ pageTitle }}
      </h1>
      <p class="text-xs text-zinc-400 mt-0.5">
        Welcome back, <span class="text-zinc-200 font-medium">{{ authStore.userProfile?.username || 'Athlete' }}</span>
      </p>
    </div>

    <div class="flex items-center gap-3">
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success-muted text-success border border-success/20">
        <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
        3 Day Streak
      </span>
    </div>
  </header>
</template>