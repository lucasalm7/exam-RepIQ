<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <aside class="w-64 glass-panel border-r border-surface-border flex flex-col justify-between p-4 hidden md:flex">
    
    <div class="space-y-6">
      <!-- App Brand Logo -->
      <div class="flex items-center gap-2 px-2">
        <div class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30">
          L
        </div>
        <span class="text-lg font-bold tracking-tight text-white">RepIQ</span>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1">
        <RouterLink 
          to="/" 
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-hover hover:text-white"
          active-class="bg-primary-muted text-primary border border-primary/30"
        >
          Overview
        </RouterLink>

        <RouterLink 
          to="/workouts" 
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-hover hover:text-white"
          active-class="bg-primary-muted text-primary border border-primary/30"
        >
          Workouts
        </RouterLink>

        <RouterLink 
          to="/meals" 
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-hover hover:text-white"
          active-class="bg-primary-muted text-primary border border-primary/30"
        >
          Meals & Diet
        </RouterLink>

        <RouterLink 
          to="/goals" 
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-hover hover:text-white"
          active-class="bg-primary-muted text-primary border border-primary/30"
        >
          Goals
        </RouterLink>

        <RouterLink 
          to="/friends" 
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-surface-hover hover:text-white"
          active-class="bg-primary-muted text-primary border border-primary/30"
        >
          Friends
        </RouterLink>

        <!-- Admin Only Navigation Link -->
        <RouterLink 
          v-if="authStore.isAdmin"
          to="/admin" 
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-accent transition-colors hover:bg-surface-hover"
          active-class="bg-accent/15 text-accent border border-accent/30"
        >
          Admin Panel
        </RouterLink>
      </nav>
    </div>

    <!-- User Profile & Logout Section -->
    <div class="pt-4 border-t border-surface-border flex items-center justify-between px-2">
      <RouterLink to="/profile" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div class="w-8 h-8 rounded-full bg-surface-border flex items-center justify-center font-semibold text-xs text-white">
          {{ authStore.userProfile?.username?.[0]?.toUpperCase() || 'U' }}
        </div>
        <span class="text-xs font-medium text-zinc-200 truncate max-w-[100px]">
          {{ authStore.userProfile?.username }}
        </span>
      </RouterLink>

      <button 
        @click="authStore.logout" 
        class="text-xs text-zinc-400 hover:text-primary transition-colors cursor-pointer"
      >
        Log out
      </button>
    </div>

  </aside>
</template>