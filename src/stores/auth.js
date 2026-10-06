// file handles authentication state and user profile management using Appwrite
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Query } from 'appwrite'
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'

export const useAuthStore = defineStore('auth', () => {// Holds the authenticated Appwrite account details ($id, email, etc.)
  const user = ref(null)// Holds the physical profile document loaded from the 'profiles' collection
  const userProfile = ref(null)// Tracks whether initial auth check has completed on app startup
  const isInitialized = ref(false)// Global loading state for authentication actions
  const isLoading = ref(false)// Global error message container
  const error = ref(null)

  // User is authenticated if both an account session and profile exist
  const isAuthenticated = computed(() => Boolean(user.value))
  // Checks if the user profile has the admin flag set to true
const labels = computed(() =>
  (user.value?.labels ?? []).map(label => label.toLowerCase())
)
  const isAdmin = computed(() => labels.value.includes('admin'))
  const isTeam = computed(() => labels.value.includes('team'))
  const canAccessAdmin = computed(() => isAdmin.value || isTeam.value)

  // Fetches current session and loads user profile from Appwrite Database
  async function fetchCurrentUser() {
    isLoading.value = true
    error.value = null
    try {
      // Get current logged-in Appwrite account
      const currentAccount = await account.get()
      user.value = currentAccount

      // Fetch matching profile document using userId
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROFILES,
        [Query.equal('userId', currentAccount.$id)]
      )

      if (response.documents.length > 0) {
        userProfile.value = response.documents[0]
      } else {
        userProfile.value = null
      }
    } catch (err) {
      // Session does not exist or user is logged out
      if (err.code !== 401) { console.error('Failed to load account or profile:', err)}
      user.value = null
      userProfile.value = null
    } finally {
      isInitialized.value = true
      isLoading.value = false
    }
  }

  // Account Registration
  async function register(email, password, username) {
    isLoading.value = true
    error.value = null
    try {
      // Create account in Appwrite Auth
      const newAccount = await account.create('unique()', email, password, username)
      
      // Auto-login user upon creation
      await account.createEmailPasswordSession(email, password)
      user.value = newAccount

      return newAccount
    } catch (err) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Saving Onboarding Profile Data
  async function createProfile(profileData) {
    isLoading.value = true
    error.value = null
    try {
      if (!user.value) throw new Error('No authenticated user found')

      // Prepare profile payload matching Appwrite schema
      const payload = {
        userId: user.value.$id,
        username: user.value.name || profileData.username,
        birthDate: profileData.birthdate,
        height: Number(profileData.height),
        weight: Number(profileData.weight),
        gender: profileData.gender,
        activityLevel: profileData.activityLevel,
        bmr: profileData.bmr || null,
        tdee: profileData.tdee || null,
        isPrivate: false,
      }

      // Create profile document in 'profiles' collection
      const profile = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PROFILES,
        'unique()',
        payload
      )

      userProfile.value = profile
      return profile
    } catch (err) {
      error.value = err.message || 'Profile creation failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Handles Login with Email & Password
  async function login(email, password) {
    isLoading.value = true
    error.value = null
    try {
      await account.createEmailPasswordSession(email, password)
      await fetchCurrentUser()
    } catch (err) {
      error.value = err.message || 'Invalid email or password'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Handles Session Logout
  async function logout() {
    isLoading.value = true
    error.value = null
    try {
      await account.deleteSession('current')
      user.value = null
      userProfile.value = null
    } catch (err) {
      error.value = err.message || 'Logout failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    userProfile,
    isInitialized,
    isLoading,
    error,
    labels,
    isAuthenticated,
    isAdmin,
    isTeam,
    canAccessAdmin,
    fetchCurrentUser,
    register,
    createProfile,
    login,
    logout,
  }
})