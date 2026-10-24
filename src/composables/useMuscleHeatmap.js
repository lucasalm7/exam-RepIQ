import { computed, ref } from 'vue'
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
import { Query } from 'appwrite'
import { useCalendarExercises } from '@/composables/useCalendarSelectors'
// This composable fetches the logged workouts for the focused week and determines which muscle categories were targeted.
//useMuscleHeatmap is designed to be used in components that need to display a muscle heatmap based on the user's logged exercises for the selected week.
export function useMuscleHeatmap(authStore, logsStore) {
  const { allExercises, loadAllExercises } = useCalendarExercises()
  const isLoading = ref(false)
  const weeklyCategories = ref(new Set())

  // Calculate the 7-day Monday–Sunday week based on logsStore.selectedDate
  const activeWeekDates = computed(() => {
    const baseDate = logsStore.selectedDate ? new Date(logsStore.selectedDate) : new Date()
    
    const dayOfWeek = baseDate.getDay()
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

    const monday = new Date(baseDate)
    monday.setDate(baseDate.getDate() + distanceToMon)

    const dates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      dates.push(d.toISOString().split('T')[0])
    }
    return dates
  })

  // Fetch logged workouts for the focused week
  async function fetchWeeklyTargetedMuscles() {
    const userId = authStore.userProfile?.$id || authStore.user?.$id
    if (!userId) return

    isLoading.value = true

    try {
      if (allExercises.value.length === 0) {
        await loadAllExercises()
      }

      const categoryMap = new Map()// Map exercise IDs to their categories for quick lookup
      allExercises.value.forEach(ex => {
        if (ex.$id && ex.category) {
          categoryMap.set(ex.$id, ex.category.toLowerCase())
        }
      })

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CALENDAR,
        [
          Query.equal('userId', userId),
          Query.equal('type', 'exercise'),
          Query.equal('date', activeWeekDates.value),
        ]
      )
// Create a set to store unique muscle categories targeted during the week
      const activeSet = new Set()
      response.documents.forEach(doc => {
        const category = categoryMap.get(doc.itemId)
        if (category) {
          activeSet.add(category)
        } else if (doc.parsedDetails?.category) {
          activeSet.add(doc.parsedDetails.category.toLowerCase())
        }
      })

      weeklyCategories.value = activeSet
    } catch (err) {
      console.error('Failed to load weekly muscle heatmap:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    weeklyCategories,
    fetchWeeklyTargetedMuscles,
  }
}