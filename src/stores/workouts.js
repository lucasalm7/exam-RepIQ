// CRUD operations for user exercises using Appwrite database
import { ID, Permission, Query, Role } from 'appwrite'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
import { useAuthStore } from '@/stores/auth'

export const useWorkoutsStore = defineStore('workouts', () => {
  const userExercises = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Helper to resolve active user ID from auth store
  function getUserId() {
    const authStore = useAuthStore()
    return authStore.userProfile?.$id || authStore.user?.$id
  }

  async function fetchUserExercises() {
    isLoading.value = true
    error.value = null

    try {
      const userId = getUserId()
      if (!userId) throw new Error('User not authenticated')

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USER_EXERCISES,
        [
          Query.equal('userId', userId),
          Query.orderAsc('name'),
        ],
      )

      userExercises.value = response.documents
      return response.documents
    } catch (err) {
      error.value = err.message || 'Failed to load your exercises'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addUserExercise(exerciseData) {
    isLoading.value = true
    error.value = null

    try {
      const userId = getUserId()
      if (!userId) throw new Error('User not authenticated')

      const exercise = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USER_EXERCISES,
        ID.unique(),
        {
          ...exerciseData,
          userId,
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      )

      userExercises.value.push(exercise)
      return exercise
    } catch (err) {
      error.value = err.message || 'Failed to add exercise'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateUserExercise(exerciseId, exerciseData) {
    isLoading.value = true
    error.value = null

    try {
      const exercise = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USER_EXERCISES,
        exerciseId,
        exerciseData,
      )

      const index = userExercises.value.findIndex(
        item => item.$id === exerciseId,
      )

      if (index !== -1) {
        userExercises.value[index] = exercise
      }

      return exercise
    } catch (err) {
      error.value = err.message || 'Failed to update exercise'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUserExercise(exerciseId) {
    isLoading.value = true
    error.value = null

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.USER_EXERCISES,
        exerciseId,
      )

      userExercises.value = userExercises.value.filter(
        item => item.$id !== exerciseId,
      )
    } catch (err) {
      error.value = err.message || 'Failed to delete exercise'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    userExercises,
    isLoading,
    error,
    fetchUserExercises,
    addUserExercise,
    updateUserExercise,
    deleteUserExercise,
  }
})