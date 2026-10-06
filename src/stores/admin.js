import { ID, Query } from 'appwrite'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  DATABASE_ID,
  databases,
  COLLECTIONS,
} from '@/lib/appwrite'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

function requireStaff() {
  if (!authStore.canAccessAdmin) {
    throw new Error('Staff access required')
  }
}

function requireAdmin() {
  if (!authStore.isAdmin) {
    throw new Error('Admin access required')
  }
}

export const useAdminStore = defineStore('admin', () => {

  const exerciseLibrary = ref([])
  const presetMealLibrary = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Sort Library
  function sortLibrary(lib) {
    lib.sort((a, b) => a.name.localeCompare(b.name))
  }

  // --- Exercise CRUD ---
  async function fetchExerciseLibrary() {
    requireStaff()
    isLoading.value = true
    error.value = null

    try {
      const documents = []
      let offset = 0
      const limit = 100

      while (true) {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.EXERCISES,
          [
            Query.orderAsc('name'),
            Query.limit(limit),
            Query.offset(offset),
          ],
        )

        documents.push(...response.documents)

        if (documents.length >= response.total || response.documents.length === 0) {
          break
        }

        offset += response.documents.length
      }

      exerciseLibrary.value = documents
      return documents
    } catch (err) {
      error.value = err?.message || 'Failed to fetch exercise library'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addGlobalExercise(exerciseData) {
    requireStaff()
    isLoading.value = true
    error.value = null

    try {
      const exercise = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.EXERCISES,
        ID.unique(),
        exerciseData,
      )

      exerciseLibrary.value.push(exercise)
      sortLibrary(exerciseLibrary.value)
      return exercise
    } catch (err) {
      error.value = err?.message || 'Failed to add exercise'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteGlobalExercise(exerciseId) {
    requireAdmin()
    isLoading.value = true
    error.value = null

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.EXERCISES,
        exerciseId,
      )

      exerciseLibrary.value = exerciseLibrary.value.filter(item => item.$id !== exerciseId)
    } catch (err) {
      error.value = err?.message || 'Failed to delete exercise'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // --- Preset Meal CRUD ---
  async function fetchPresetMealLibrary() {
    requireStaff()
    isLoading.value = true
    error.value = null

    try {
      const documents = []
      let offset = 0
      const limit = 100

      while (true) {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PRESET_MEALS,
          [
            Query.orderAsc('name'),
            Query.limit(limit),
            Query.offset(offset),
          ],
        )

        documents.push(...response.documents)

        if (documents.length >= response.total || response.documents.length === 0) {
          break
        }

        offset += response.documents.length
      }

      presetMealLibrary.value = documents
      return documents
    } catch (err) {
      error.value = err?.message || 'Failed to fetch preset meals'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addPresetMeal(mealData) {
    requireStaff()
    isLoading.value = true
    error.value = null

    try {
      const meal = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PRESET_MEALS,
        ID.unique(),
        mealData,
      )

      presetMealLibrary.value.push(meal)
      sortLibrary(presetMealLibrary.value)
      return meal
    } catch (err) {
      error.value = err?.message || 'Failed to add preset meal'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deletePresetMeal(mealId) {
    requireAdmin()
    isLoading.value = true
    error.value = null

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.PRESET_MEALS,
        mealId,
      )

      presetMealLibrary.value = presetMealLibrary.value.filter(item => item.$id !== mealId)
    } catch (err) {
      error.value = err?.message || 'Failed to delete preset meal'
      throw err
    } finally {
      isLoading.value = false
    }
  }

async function updateGlobalExercise(id, payload) {
  requireStaff()
  isLoading.value = true
  error.value = null
  try {
    const updated = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.EXERCISES,
      id,
      payload
    )
    const index = exerciseLibrary.value.findIndex((e) => e.$id === id)
    if (index !== -1) exerciseLibrary.value[index] = updated
    return updated
  } catch (err) {
    error.value = err.message || 'Failed to update exercise'
    throw err
  } finally {
    isLoading.value = false
  }
}

async function updatePresetMeal(id, payload) {
  requireStaff()
  isLoading.value = true
  error.value = null
  try {
    const updated = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.PRESET_MEALS,
      id,
      payload
    )
    const index = presetMealLibrary.value.findIndex((m) => m.$id === id)
    if (index !== -1) presetMealLibrary.value[index] = updated
    return updated
  } catch (err) {
    error.value = err.message || 'Failed to update preset meal'
    throw err
  } finally {
    isLoading.value = false
  }
}
  return {
    exerciseLibrary,
    presetMealLibrary,
    isLoading,
    error,
    fetchExerciseLibrary,
    addGlobalExercise,
    deleteGlobalExercise,
    fetchPresetMealLibrary,
    addPresetMeal,
    deletePresetMeal,
    updateGlobalExercise,
    updatePresetMeal,
  }
})