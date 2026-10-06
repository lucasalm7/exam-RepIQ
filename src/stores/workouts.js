// CRUD operations for user exercises using Appwrite database
import { ID, Permission, Query, Role } from 'appwrite'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'

export const useWorkoutsStore = defineStore('user_exercises', () => {
  const userExercises = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchUserExercises() {
    isLoading.value = true
    error.value = null

    try {
      const user = await account.get()

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.user_exercises,
        [
          Query.equal('userId', user.$id),
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
      const user = await account.get()

      const exercise = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.user_exercises,
        ID.unique(),
        {
          ...exerciseData,
          userId: user.$id,
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
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
        COLLECTIONS.user_exercises,
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
        COLLECTIONS.user_exercises,
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