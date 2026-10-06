// CRUD operations for user meals using Appwrite database
import { ID, Permission, Query, Role } from 'appwrite'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { account, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'

export const useMealsStore = defineStore('meals', () => {
  const userMeals = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchUserMeals() {
    isLoading.value = true
    error.value = null

    try {
      const user = await account.get()

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MEALS,
        [
          Query.equal('userId', user.$id),
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
      const user = await account.get()

      const meal = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MEALS,
        ID.unique(),
        {
          ...mealData,
          userId: user.$id,
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
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
    const updatedMeal = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.MEALS,
      mealId,
      mealData,
    )

    const index = userMeals.value.findIndex(
      meal => meal.$id === mealId,
    )

    if (index !== -1) {
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

      userMeals.value = userMeals.value.filter(
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