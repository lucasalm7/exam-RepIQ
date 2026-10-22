import { defineStore } from 'pinia'
import { ref, computed } from 'vue' // Fixed: Added 'computed' import
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
import { Query, ID } from 'appwrite'
import { useAuthStore } from '@/stores/auth'

// this const is a Pinia store for managing user logs, including daily and weekly calendar entries. 
// It provides functions to fetch, add, and remove exercise and meal logs while maintaining loading and error states.
export const useLogsStore = defineStore('logs', () => {
  const selectedDate = ref(new Date().toISOString().split('T')[0])
  const dailyCalendarItems = ref([]) // Format: [{ $id, date, type, itemId, sourceType, itemName, details, completed }]
  const weeklyOverviewMap = ref({}) // Format: { 'YYYY-MM-DD': { hasExercise: true, hasMeal: true } }
  const isLoading = ref(false)
  const error = ref('')

  // Filter only meal logs for the current selected date
  const dailyMeals = computed(() =>
    dailyCalendarItems.value.filter(item => item.type === 'meal')
  )

  // Helper function to safely extract numerical values from details or parsedDetails
  function getMacroValue(item, key) {
    if (item.parsedDetails && item.parsedDetails[key] !== undefined) {
      return Number(item.parsedDetails[key]) || 0
    }
    if (item.details) {
      try {
        const parsed = typeof item.details === 'string' ? JSON.parse(item.details) : item.details
        return Number(parsed[key]) || 0
      } catch (e) {
        return 0
      }
    }
    return 0
  }

  // Total Calories (kcal)
  const totalDailyCalories = computed(() =>
    dailyMeals.value.reduce((sum, item) => sum + getMacroValue(item, 'calories'), 0)
  )

  // Total Protein (g)
  const totalDailyProtein = computed(() =>
    dailyMeals.value.reduce((sum, item) => sum + getMacroValue(item, 'protein'), 0)
  )

  // Total Carbs (g)
  const totalDailyCarbs = computed(() =>
    dailyMeals.value.reduce((sum, item) => sum + getMacroValue(item, 'carbs'), 0)
  )

  // Total Fats (g)
  const totalDailyFats = computed(() =>
    dailyMeals.value.reduce((sum, item) => sum + getMacroValue(item, 'fats'), 0) // this function calculates the total fats consumed in a day by summing up the 'fats' values from all meal logs for the selected date.
  )

  // Combined Summary Object
  const dailyMacroTotals = computed(() => ({
    calories: totalDailyCalories.value,
    protein: totalDailyProtein.value,
    carbs: totalDailyCarbs.value,
    fats: totalDailyFats.value,
  }))

  // Fetch all calendar entries for a specific YYYY-MM-DD date
  async function fetchCalendarByDate(dateString) {
    selectedDate.value = dateString // Update the selected date
    const authStore = useAuthStore() // Get the current authenticated user's ID from the auth store
    const userId = authStore.userProfile?.$id || authStore.user?.$id // Use the profile ID if available, otherwise fallback to account ID

    if (!userId) return

    isLoading.value = true
    error.value = ''
    try { // Fetch all calendar entries for the specified date and user
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CALENDAR,
        [
          Query.equal('userId', userId),
          Query.equal('date', dateString),
        ]
      )
      // Map the fetched documents to include parsed details for easier access.
      dailyCalendarItems.value = response.documents.map(doc => ({
        ...doc,
        parsedDetails: doc.details ? JSON.parse(doc.details) : {}, //details is stored as a JSON string in the database, so we parse it into an object for easier access in the UI.
      }))
    } catch (err) {
      console.error('Failed to fetch calendar entries:', err)
      error.value = err.message || 'Failed to load calendar'
    } finally {
      isLoading.value = false
    }
  }

  // Fetch presence indicator flags for all days in the visible 7-day week
  async function fetchWeeklyOverview(weekDates) {
    const authStore = useAuthStore()
    const userId = authStore.userProfile?.$id || authStore.user?.$id

    if (!userId || !weekDates.length) return

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CALENDAR,
        [
          Query.equal('userId', userId),
          Query.equal('date', weekDates),
        ]
      )

      const map = {} // map is an object that will hold the presence indicators for each date in the week. Each date will have a corresponding object indicating whether there are exercise or meal logs for that day.
      weekDates.forEach(date => {
        map[date] = { hasExercise: false, hasMeal: false }
      })

      response.documents.forEach(doc => {
        if (map[doc.date]) {
          if (doc.type === 'exercise') map[doc.date].hasExercise = true // this function updates the weekly overview map to indicate whether there are exercise or meal logs for each date in the week. It checks the type of each document and sets the corresponding flags in the map.
          if (doc.type === 'meal') map[doc.date].hasMeal = true // this function updates the weekly overview map to indicate whether there are exercise or meal logs for each date in the week. It checks the type of each document and sets the corresponding flags in the map.
        }
      })

      weeklyOverviewMap.value = map
    } catch (err) {
      console.error('Failed to fetch weekly overview:', err)
    }
  }

  // Save a new exercise or meal to the calendar collection
  async function addToCalendar(payload) {
    const authStore = useAuthStore()
    const userId = authStore.userProfile?.$id || authStore.user?.$id

    if (!userId) throw new Error('User not authenticated')

    isLoading.value = true
    try {
      const documentData = {
        userId,
        date: payload.date,
        type: payload.type, // 'exercise' or 'meal'
        itemId: payload.itemId,
        sourceType: payload.sourceType, // 'global', 'preset', 'personal'
        itemName: payload.itemName,
        details: JSON.stringify(payload.details || {}),
        completed: false,
      }

      const createdDoc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CALENDAR,
        ID.unique(),
        documentData
      )

      const parsedDoc = {
        ...createdDoc,
        parsedDetails: payload.details || {},
      }

      dailyCalendarItems.value.push(parsedDoc)

      // Update weekly overview flags dynamically
      if (!weeklyOverviewMap.value[payload.date]) {
        weeklyOverviewMap.value[payload.date] = { hasExercise: false, hasMeal: false }
      }
      if (payload.type === 'exercise') weeklyOverviewMap.value[payload.date].hasExercise = true
      if (payload.type === 'meal') weeklyOverviewMap.value[payload.date].hasMeal = true

      return parsedDoc
    } catch (err) {
      console.error('Failed to add to calendar:', err)
      error.value = err.message || 'Failed to save item'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Remove item from calendar
  async function removeFromCalendar(documentId) {
    isLoading.value = true
    error.value = ''
    try {
      const targetItem = dailyCalendarItems.value.find(item => item.$id === documentId)

      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.CALENDAR,
        documentId
      )

      dailyCalendarItems.value = dailyCalendarItems.value.filter(
        item => item.$id !== documentId
      )

      // this if block checks if the removed item exists and if its date is present in the weekly overview map. If so, it checks if there are any remaining items of the same type (exercise or meal) for that date. It then updates the weekly overview flags accordingly to reflect whether there are still exercise or meal logs for that date after the deletion.
      if (targetItem && weeklyOverviewMap.value[targetItem.date]) {
        const remainingOfType = dailyCalendarItems.value.some(i => i.type === targetItem.type)
        if (targetItem.type === 'exercise') {
          weeklyOverviewMap.value[targetItem.date].hasExercise = remainingOfType
        } else if (targetItem.type === 'meal') {
          weeklyOverviewMap.value[targetItem.date].hasMeal = remainingOfType
        }
      }
    } catch (err) {
      console.error('Failed to delete calendar item:', err)
      error.value = err.message || 'Failed to delete item'
    } finally {
      isLoading.value = false
    }
  }

  return {
    selectedDate,
    dailyCalendarItems,
    weeklyOverviewMap,
    isLoading,
    error,
    dailyMeals,
    totalDailyCalories,
    totalDailyProtein,
    totalDailyCarbs,
    totalDailyFats,
    dailyMacroTotals,
    fetchCalendarByDate,
    fetchWeeklyOverview,
    addToCalendar,
    removeFromCalendar,
  }
})