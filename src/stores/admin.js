import { ID, Query } from 'appwrite'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  DATABASE_ID,
  databases,
  COLLECTIONS,
} from '@/lib/appwrite'
import { useAuthStore } from '@/stores/auth'

// this const is a Pinia store for managing admin-related data and actions, including exercise and preset meal libraries. It provides functions to fetch, add, update, and delete documents in the Appwrite database while enforcing access control based on user roles (admin or staff).
export const useAdminStore = defineStore('admin', () => {
  const exerciseLibrary = ref([])
  const presetMealLibrary = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  function getAuthStore() {
    return useAuthStore()
  }

  function requireStaff() {
    const authStore = getAuthStore()
    if (!authStore.canAccessAdmin) {
      throw new Error('Staff access required')
    }
  }

  function requireAdmin() {
    const authStore = getAuthStore()
    if (!authStore.isAdmin) {
      throw new Error('Admin access required')
    }
  }

  function sortLibrary(lib) {
    lib.sort((a, b) => a.name.localeCompare(b.name))
  }

  // this function fetches all documents from a collection in a paginated manner
  async function fetchPaginatedDocuments(collectionId) {
    const documents = []
    let offset = 0 // Start with an offset of 0
    const limit = 100 // Number of documents to fetch per request because Appwrite has a limit on the number of documents returned in a single request

    while (true) {
      const response = await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        [
          Query.orderAsc('name'),
          Query.limit(limit),
          Query.offset(offset),
        ]
      )

      documents.push(...response.documents)

      if (documents.length >= response.total || response.documents.length === 0) {
        break
      }

      offset += response.documents.length
    }
    return documents
  }

  // --- Exercise CRUD ---
  // this function fetches all exercise documents from the EXERCISES collection in the Appwrite database. It requires staff access, sets loading and error states, and updates the local exerciseLibrary state with the fetched documents.
  async function fetchExerciseLibrary() {
    requireStaff()
    isLoading.value = true
    error.value = null

    try {
      const documents = await fetchPaginatedDocuments(COLLECTIONS.EXERCISES)
      exerciseLibrary.value = documents
      return documents
    } catch (err) {
      error.value = err?.message || 'Failed to fetch exercise library'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // this function adds a new exercise document to the EXERCISES collection in the Appwrite database. 
  // It requires staff access, sets loading and error states, and updates the local exerciseLibrary state upon successful creation.
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
// this function updates an existing exercise document in the EXERCISES collection of the Appwrite database.
  async function updateGlobalExercise(id, payload) {
    requireStaff()
    isLoading.value = true
    error.value = null
    try {
      const updated = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.EXERCISES,
        id,
        payload// payload is an object containing the fields to be updated in the exercise document
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

  // this function deletes an exercise document from the EXERCISES collection in the Appwrite database.
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
  // this function fetches all preset meal documents from the PRESET_MEALS collection in the Appwrite database. It requires staff access, sets loading and error states, and updates the local presetMealLibrary state with the fetched documents.
  async function fetchPresetMealLibrary() {
    requireStaff()
    isLoading.value = true
    error.value = null

    try {
      const documents = await fetchPaginatedDocuments(COLLECTIONS.PRESET_MEALS)
      presetMealLibrary.value = documents
      return documents
    } catch (err) {
      error.value = err?.message || 'Failed to fetch preset meals'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // this function adds a new preset meal document to the PRESET_MEALS collection in the Appwrite database.
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

  // this function updates an existing preset meal document in the PRESET_MEALS collection of the Appwrite database.
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

  // this function deletes a preset meal document from the PRESET_MEALS collection in the Appwrite database.
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

  return {
    exerciseLibrary,
    presetMealLibrary,
    isLoading,
    error,
    fetchExerciseLibrary,
    addGlobalExercise,
    updateGlobalExercise,
    deleteGlobalExercise,
    fetchPresetMealLibrary,
    addPresetMeal,
    updatePresetMeal,
    deletePresetMeal,
  }
})