import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userProfile = ref({
    username: 'Athlete',
    role: 'user',
  })

  const isInitialized = ref(false)

  const isAuthenticated = computed(() => Boolean(userProfile.value))
  const isAdmin = computed(() => userProfile.value?.role === 'admin')

  async function fetchCurrentUser() {
    isInitialized.value = true
    userProfile.value = {
      username: 'Athlete',
      role: 'user',
    }
  }

  return {
    userProfile,
    isInitialized,
    isAuthenticated,
    isAdmin,
    fetchCurrentUser,
  }
})