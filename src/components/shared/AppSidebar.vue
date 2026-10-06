<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  try {
    await authStore.logout()
    await router.push({ name: 'auth' })
  } catch {
  }
}
</script>

<template>
  <aside class="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between overflow-hidden border-r border-surface-border p-4 glass-panel md:flex">    
    <div class="space-y-6">
      <!-- App Brand Logo -->
      <div class="flex items-center gap-2 px-2">
        <div class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30">
          R
        </div>
        <span class="text-lg font-bold tracking-tight text-white">RepIQ</span>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1">
        <RouterLink to="/" class="nav-link" active-class="bg-primary-muted text-primary border border-primary/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="#ff2e93" d="M3.385 18q-.69 0-1.153-.462t-.463-1.153v-8.77q0-.69.463-1.152T3.384 6h8.77q.69 0 1.153.463t.462 1.153v8.769q0 .69-.462 1.153T12.154 18zM17 18V6h1v12zm4.23 0V6h1v12z" />
          </svg>
          Overview
        </RouterLink>

        <RouterLink to="/workouts" class="nav-link" active-class="bg-primary-muted text-primary border border-primary/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="#ff2e93" d="M17 7c.393 0 .714.321.714.714v8.572A.716.716 0 0 1 17 17h-2.857a.716.716 0 0 1-.714-.714v-2.143h-2.858v2.143a.716.716 0 0 1-.714.714H7a.716.716 0 0 1-.714-.714V7.714C6.286 7.321 6.607 7 7 7h2.857c.393 0 .714.321.714.714v2.143h2.858V7.714c0-.393.321-.714.714-.714ZM3.429 9.143a.714.714 0 0 1 .714-.714h.714v7.142h-.714a.714.714 0 0 1-.714-.714v-1.428a1.429 1.429 0 0 1 0-2.858Zm17.142 1.428a1.429 1.429 0 0 1 0 2.858v1.428a.714.714 0 0 1-.714.714h-.714V8.429h.714a.714.714 0 0 1 .714.714Z" />
        </svg>
          Workouts
        </RouterLink>

        <RouterLink to="/meals" class="nav-link" active-class="bg-primary-muted text-primary border border-primary/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512">
          <path d="M0 0h512v512H0z" fill="none" />
          <path fill="#ff2e93" d="M439 166.29c-18.67-32.57-47.46-50.81-85.57-54.23c-20.18-1.8-39 3.37-57.23 8.38c-14.15 3.89-27.52 7.56-40.2 7.56s-26-3.68-40.06-7.57c-18.28-5-37.18-10.26-57.43-8.36c-36.39 3.41-65.51 22.11-84.31 54.08C56.82 195.76 48 236.76 48 288c0 40.4 15 90.49 40 134c12.82 22.25 47 74 87.16 74c30.77 0 47.15-9.44 59.11-16.33c8.3-4.78 13.31-7.67 21.69-7.67s13.39 2.89 21.69 7.67c12 6.89 28.35 16.33 59.15 16.33c40.17 0 74.34-51.76 87.16-74c25.07-43.5 40-93.59 40-134c.04-52.57-8.14-92.38-24.96-121.71M216 352c-13.25 0-24-21.49-24-48s10.75-48 24-48s24 21.49 24 48s-10.75 48-24 48m80 0c-13.25 0-24-21.49-24-48s10.75-48 24-48s24 21.49 24 48s-10.75 48-24 48" />
          <path fill="#ff2e93" d="M265.1 111.93c13.16-1.75 37.86-7.83 58.83-28.79a98 98 0 0 0 28-58.2a8 8 0 0 0-8.55-8.94c-12.71.95-36.76 5.87-58.73 27.85A97.6 97.6 0 0 0 256 103.2a8 8 0 0 0 9.1 8.73" />
        </svg>

          Meals & Diet
        </RouterLink>

        <RouterLink to="/goals" class="nav-link" active-class="bg-primary-muted text-primary border border-primary/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16">
          <path d="M0 0h16v16H0z" fill="none" />
          <path fill="#ff2e93" d="m13.637 2.363l1.676.335c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.373 1.374a.88.88 0 0 1-.619.256H12.31L9.45 7.611A1.5 1.5 0 1 1 6.5 8a1.5 1.5 0 0 1 1.889-1.449l2.861-2.862V2.552c0-.232.092-.455.256-.619L12.88.559a.25.25 0 0 1 .249-.062c.089.026.155.1.173.19Z" />
          <path fill="#ff2e93" d="M2 8a6 6 0 1 0 11.769-1.656a.751.751 0 1 1 1.442-.413a7.502 7.502 0 0 1-12.513 7.371A7.501 7.501 0 0 1 10.069.789a.75.75 0 0 1-.413 1.442A6 6 0 0 0 2 8" />
          <path fill="#ff2e93" d="M5 8a3.002 3.002 0 0 0 4.699 2.476a3 3 0 0 0 1.28-2.827a.748.748 0 0 1 1.045-.782a.75.75 0 0 1 .445.61A4.5 4.5 0 1 1 8.516 3.53a.75.75 0 1 1-.17 1.49A3 3 0 0 0 5 8" />
        </svg>
          Goals
        </RouterLink>

        <RouterLink to="/friends" class="nav-link" active-class="bg-primary-muted text-primary border border-primary/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1em" viewBox="0 0 640 512">
          <path d="M0 0h640v512H0z" fill="none" />
          <path fill="#ff2e93" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32S80 82.1 80 144s50.1 112 112 112m76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2M480 256c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96m48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4c24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48c0-61.9-50.1-112-112-112" />
        </svg>
          Friends
        </RouterLink>

        <!-- Admin Only Navigation Link -->
        <RouterLink v-if="authStore.canAccessAdmin" to="/admin" class="nav-link" active-class="bg-accent/15 text-accent border border-accent/30">
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

      <button type="button" @click="handleLogout" class="text-xs text-zinc-400 hover:text-primary transition-colors cursor-pointer">
          Log out
        </button>
    </div>

  </aside>
</template>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.75rem;
  color: #e4e4e7;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  display: block;
  color: #ff2e93;
}
</style>