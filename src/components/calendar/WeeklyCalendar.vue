<script setup>
import { onMounted, watch } from 'vue'
import { useWeeklyCalendar } from '@/composables/useWeeklyCalendar'
import CalendarExercises from './CalendarExercises.vue'
import CalendarMeals from './CalendarMeals.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import CalendarLogList from './CalendarLogList.vue'

// Destructure the returned values from the useWeeklyCalendar composable
const {
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
} = useWeeklyCalendar()

// Fetch the calendar data when the component is mounted and whenever the weekDays change
onMounted(() => {
  logsStore.fetchCalendarByDate(selectedDate.value)
  loadWeekOverview()
})
// Watch for changes in the weekDays and reload the week overview accordingly
watch(weekDays, () => {
  loadWeekOverview()
})
</script>

<template>
  <div class="space-y-6 rounded-2xl border border-surface-border bg-surface p-6">
    <!-- Header with Week Controls -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-white">Weekly Calendar</h2>
        <span class="text-xs text-zinc-400">Selected: {{ selectedDate }}</span>
      </div>

      <div class="flex items-center gap-1 rounded-xl border border-surface-border bg-background/60 p-1">
        <button type="button"
          class="rounded-lg px-2.5 py-1 text-xs text-zinc-400 hover:bg-surface-hover hover:text-white transition"
          @click="changeWeek(-1)">
          ‹ Prev
        </button>
        <button v-if="currentWeekOffset !== 0" type="button"
          class="rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-surface-hover transition"
          @click="changeWeek(0)">
          Today
        </button>
        <button type="button"
          class="rounded-lg px-2.5 py-1 text-xs text-zinc-400 hover:bg-surface-hover hover:text-white transition"
          @click="changeWeek(1)">
          Next ›
        </button>
      </div>
    </div>

    <!-- Week Strip with Indicator Dots -->
    <div class="grid grid-cols-7 gap-2">
      <!-- when clicking this button, the selected date is updated -->
      <button v-for="day in weekDays" :key="day.dateString"
        type="button" class="relative flex flex-col items-center rounded-xl border p-3 transition"
        :class="[
          selectedDate === day.dateString
            ? 'border-primary bg-primary/20 text-white'
            : 'border-surface-border bg-background/40 text-zinc-400 hover:border-primary/50',
          day.isToday ? 'ring-1 ring-primary' : '']" @click="selectDay(day.dateString)">
        <span class="text-[10px] uppercase tracking-wider">{{ day.dayName }}</span>
        <span class="mt-1 text-base font-bold text-white">{{ day.dayNumber }}</span>

        <!-- Indicator Dots -->
        <div class="mt-1.5 flex h-1.5 items-center justify-center gap-1">
          <span v-if="logsStore.weeklyOverviewMap[day.dateString]?.hasExercise"
            class="h-1.5 w-1.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500"
            title="Workout planned"/>
          <span v-if="logsStore.weeklyOverviewMap[day.dateString]?.hasMeal"
            class="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500"
            title="Meal planned"/>
        </div>
      </button>
    </div>

    <!-- Add Buttons -->
    <div class="flex gap-3">
      <button type="button"
        class="flex-1 rounded-xl bg-primary/10 border border-primary/30 py-2.5 text-xs font-semibold text-primary hover:bg-primary/20"
        @click="showExerciseModal = true">
        + Add Exercise
      </button>
      <button type="button"
        class="flex-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
        @click="showMealModal = true">
        + Add Meal
      </button>
    </div>

    <!-- Daily Log Feed -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div v-if="logsStore.isLoading" class="py-12 flex justify-center col-span-2">
        <LoadingSpinner text="Loading calendar schedule..." />
      </div>

      <!-- Logged Workouts Feed -->
      <CalendarLogList title="Logged Workouts" :items="loggedExercises"
        empty-message="No exercises logged for this day." type="exercise"
        @delete="handleDeleteItem"/>

      <!-- Logged Meals Feed -->
      <CalendarLogList title="Logged Meals" :items="loggedMeals"
        empty-message="No meals logged for this day." type="meal"
        @delete="handleDeleteItem"/>
    </div>

    <!-- Modals -->
    <CalendarExercises v-if="showExerciseModal" @select="handleAddItem" @close="showExerciseModal = false" />
    <CalendarMeals v-if="showMealModal" @select="handleAddItem" @close="showMealModal = false" />
  </div>
</template>