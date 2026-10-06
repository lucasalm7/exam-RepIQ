import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()

  const isAdmin = computed(() => authStore.isAdmin)
  const isTeam = computed(() => authStore.isTeam)
  const canAccessAdmin = computed(() => authStore.canAccessAdmin)

  return {
    isAdmin,
    isTeam,
    canAccessAdmin,
  }
}