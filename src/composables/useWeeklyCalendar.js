// src/composables/useWeeklyCalendar.js
import { computed, ref } from 'vue'
import { useLogsStore } from '@/stores/logs'

export function useWeeklyCalendar() {
  const logsStore = useLogsStore()

  const selectedDate = ref(new Date().toISOString().split('T')[0])
  const currentWeekOffset = ref(0)
  const showExerciseModal = ref(false)
  const showMealModal = ref(false)

  //weekDays is a computed property that calculates the days of the current week based on the currentWeekOffset. 
  // It returns an array of objects, each representing a day with its date string, day name, day number, and whether it is today.
  const weekDays = computed(() => {
    const now = new Date()
    now.setDate(now.getDate() + currentWeekOffset.value * 7)

    const currentDay = now.getDay()
    const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay

    const monday = new Date(now)
    monday.setDate(now.getDate() + distanceToMon)

    const todayIso = new Date().toISOString().split('T')[0]

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
      const isoDate = day.toISOString().split('T')[0]
      return {
        dateString: isoDate,
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: day.getDate(),
        isToday: isoDate === todayIso,
      }
    })
  })
// loadWeekOverview is a function that fetches the weekly overview data for the current week.
  function loadWeekOverview() {
    const dates = weekDays.value.map(d => d.dateString)
    logsStore.fetchWeeklyOverview(dates)
  }
// changeWeek is a function that changes the current week by a given offset (offsetDelta). 
// It updates the currentWeekOffset, selects the new Monday of the week, and loads the weekly overview.
  function changeWeek(offsetDelta) {
    currentWeekOffset.value = offsetDelta === 0 ? 0 : currentWeekOffset.value + offsetDelta
    const newMonday = weekDays.value[0].dateString
    selectDay(newMonday)
    loadWeekOverview()
  }
  // selectDay is a function that selects a specific day by its date string.
  function selectDay(dateString) {
    selectedDate.value = dateString
    logsStore.fetchCalendarByDate(dateString)
  }
  // handleAddItem is an asynchronous function that adds a new item (exercise or meal) to the calendar for the selected date.
  async function handleAddItem(eventData) {
    try {
      await logsStore.addToCalendar({
        ...eventData,
        date: selectedDate.value,
      })
      showExerciseModal.value = false
      showMealModal.value = false
    } catch (err) {
      // Handled in store
    }
  }
  // handleDeleteItem is an asynchronous function that deletes an item from the calendar by its document ID.
  async function handleDeleteItem(documentId) {
    await logsStore.removeFromCalendar(documentId)
  }
// loggedExercises is a computed property that filters the daily calendar items to include only those of type 'exercise'.
  const loggedExercises = computed(() =>
    logsStore.dailyCalendarItems.filter(item => item.type === 'exercise')
  )
// loggedMeals is a computed property that filters the daily calendar items to include only those of type 'meal'.
  const loggedMeals = computed(() =>
    logsStore.dailyCalendarItems.filter(item => item.type === 'meal')
  )

  return {
    logsStore,
    selectedDate,
    currentWeekOffset,
    showExerciseModal,
    showMealModal,
    weekDays,
    loggedExercises,
    loggedMeals,
    loadWeekOverview,
    changeWeek,
    selectDay,
    handleAddItem,
    handleDeleteItem,
  }
}