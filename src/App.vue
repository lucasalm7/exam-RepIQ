<!-- src/App.vue -->
<script setup>
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/common/AppSidebar.vue'
import AppHeader from '@/components/common/AppHeader.vue'

const authStore = useAuthStore()
</script>

<template>
  <!-- Full-screen layout wrapper -->
  <div class="min-h-screen bg-background text-zinc-100 flex font-sans">
    
    <!-- Render navigation ONLY when user is logged in (hides on /auth login screen) -->
    <AppSidebar v-if="authStore.isAuthenticated" />

    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader v-if="authStore.isAuthenticated" />

      <!-- Main view changes based on current route -->
      <main class="flex-1 p-6 overflow-y-auto">
        <RouterView />
      </main>
    </div>

  </div>
</template>