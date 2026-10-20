<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-6">
    <!-- Glowing 404 Accent Badge -->
    <div class="relative flex items-center justify-center">
      <div class="absolute -inset-1 rounded-3xl bg-primary/20 blur-xl"></div>
      <div class="relative px-6 py-3 rounded-2xl bg-surface border border-surface-border shadow-2xl">
        <span class="text-6xl font-black tracking-widest text-primary">404</span>
      </div>
    </div>

    <!-- Message Content -->
    <div class="max-w-md space-y-2">
      <h1 class="text-2xl font-bold text-white">Page Not Found</h1>
      <p class="text-xs text-zinc-400 leading-relaxed">
        The page you are looking for doesn't exist, was removed, or is temporarily unavailable.
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-3 pt-2">
      <button
        @click="goBack"
        class="px-4 py-2.5 rounded-xl border border-surface-border bg-surface text-xs font-semibold text-zinc-200 transition hover:bg-surface-border/50 cursor-pointer"
      >
        ← Go Back
      </button>

      <RouterLink
        to="/"
        class="px-5 py-2.5 rounded-xl bg-primary text-xs font-bold text-zinc-950 shadow-lg shadow-primary/20 transition hover:bg-primary/90"
      >
        Return Home
      </RouterLink>
    </div>
  </div>
</template>