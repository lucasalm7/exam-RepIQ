import { defineStore } from 'pinia'
import { ref } from 'vue'
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
import { Query, ID } from 'appwrite'
import { useAuthStore } from '@/stores/auth'

export const useLogsStore = defineStore('logs', () => {
  const dailyCalendarItems = ref([])
  const isLoading = ref(false)
  const error = ref('')

  // Fetch all calendar entries for a specific YYYY-MM-DD date
  async function fetchCalendarByDate(dateString) {
    const authStore = useAuthStore()
    const userId = authStore.userProfile?.$id || authStore.user?.$id

    if (!userId) return

    isLoading.value = true
    error.value = ''
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CALENDAR,
        [
          Query.equal('userId', userId),
          Query.equal('date', dateString),
        ]
      )

      // Parse JSON details string back into objects
      dailyCalendarItems.value = response.documents.map(doc => ({
        ...doc,
        parsedDetails: doc.details ? JSON.parse(doc.details) : {},
      }))
    } catch (err) {
      console.error('Failed to fetch calendar entries:', err)
      error.value = err.message || 'Failed to load calendar'
    } finally {
      isLoading.value = false
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
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.CALENDAR,
      documentId
    )
    // Filter out the deleted item from state
    dailyCalendarItems.value = dailyCalendarItems.value.filter(
      item => item.$id !== documentId
    )
  } catch (err) {
    console.error('Failed to delete calendar item:', err)
    error.value = err.message || 'Failed to delete item'
  } finally {
    isLoading.value = false
  }
}

  return {
    dailyCalendarItems,
    isLoading,
    error,
    fetchCalendarByDate,
    addToCalendar,
    removeFromCalendar,
  }
})