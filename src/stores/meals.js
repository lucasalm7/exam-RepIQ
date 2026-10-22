// CRUD operations for user meals using Appwrite database
import { ID, Permission, Query } from 'appwrite'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
import { useAuthStore } from '@/stores/auth'

// This Pinia store manages user meals, providing functions to fetch, add, update, and delete meal entries while maintaining loading and error states.
export const useMealsStore = defineStore('meals', () => {
  const userMeals = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Helper to resolve active user ID cleanly from auth store
  function getUserId() {
    const authStore = useAuthStore()// This function retrieves the user ID from the authentication store, checking both the user profile and the user object. It returns the user ID if available, or null if the user is not authenticated.
    return authStore.userProfile?.$id || authStore.user?.$id
  }

  async function fetchUserMeals() {
    isLoading.value = true
    error.value = null

    try {
      const userId = getUserId()
      if (!userId) throw new Error('User not authenticated')

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MEALS,
        [
          Query.equal('userId', userId),
          Query.orderAsc('name'),
        ],
      )

      userMeals.value = response.documents
      return response.documents
    } catch (err) {
      error.value = err.message || 'Failed to load your meals'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addUserMeal(mealData) {
    isLoading.value = true
    error.value = null

    try {
      const userId = getUserId()
      if (!userId) throw new Error('User not authenticated')

      const meal = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MEALS,
        ID.unique(),
        {
          ...mealData,
          userId,
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      )

      userMeals.value.push(meal)
      return meal
    } catch (err) {
      error.value = err.message || 'Failed to add meal'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateUserMeal(mealId, mealData) {
    isLoading.value = true
    error.value = null

    try {
      const updatedMeal = await databases.updateDocument(// This function updates an existing user meal document in the Appwrite database. It takes the meal ID and the new meal data as parameters, updates the document, and then updates the local state to reflect the changes. If the update fails, it sets an error message.
        DATABASE_ID,
        COLLECTIONS.MEALS,
        mealId,
        mealData,
      )

      const index = userMeals.value.findIndex(// This line finds the index of the meal in the local state array that matches the provided meal ID. It uses the findIndex method to locate the meal by its unique identifier.
        meal => meal.$id === mealId,
      )

      if (index !== -1) { // If the meal is found in the local state, update it with the new data.
        userMeals.value[index] = updatedMeal
      }

      return updatedMeal
    } catch (err) {
      error.value = err.message || 'Failed to update meal'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUserMeal(mealId) {
    isLoading.value = true
    error.value = null

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.MEALS,
        mealId,
      )

      userMeals.value = userMeals.value.filter(// This line filters the local state array of user meals to remove the meal that was just deleted from the database. It creates a new array that excludes the meal with the specified meal ID.
        meal => meal.$id !== mealId,
      )
    } catch (err) {
      error.value = err.message || 'Failed to delete meal'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    userMeals,
    isLoading,
    error,
    fetchUserMeals,
    addUserMeal,
    updateUserMeal,
    deleteUserMeal,
  }
})