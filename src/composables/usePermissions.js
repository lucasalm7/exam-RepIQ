import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()// Access the authentication store to retrieve user information and permissions

  const isAdmin = computed(() => authStore.isAdmin)// Creates a computed property that checks if the authenticated user has administrative privileges by accessing the isAdmin property from the authentication store. It allows components to reactively respond to changes in the user's admin status.
  const isTeam = computed(() => authStore.isTeam)// Creates a computed property that checks if the authenticated user is part of a team by accessing the isTeam property from the authentication store. It enables components to reactively respond to changes in the user's team membership status.
  const canAccessAdmin = computed(() => authStore.canAccessAdmin)// Creates a computed property that checks if the authenticated user has access to administrative features by accessing the canAccessAdmin property from the authentication store. It allows components to reactively respond to changes in the user's access rights.

  return {
    isAdmin,
    isTeam,
    canAccessAdmin,
  }
}