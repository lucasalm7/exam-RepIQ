<script setup>
import { computed, onMounted, watch } from 'vue'
import { useLogsStore } from '@/stores/logs'
import { useAuthStore } from '@/stores/auth'
import { calculateDailyTargets } from '@/composables/useTdeeCalculator'

const logsStore = useLogsStore()
const authStore = useAuthStore()

// Filter logged exercises for the current active day
const plannedExercises = computed(() =>
  logsStore.dailyCalendarItems.filter(item => item.type === 'exercise')
)

// Dynamically compute daily targets based on profile metrics + active workouts
const targets = computed(() => {
  return calculateDailyTargets(
    authStore.userProfile,
    plannedExercises.value,
    authStore.userProfile?.goal || 'maintenance'
  )
})

// Calories SVG Ring Parameters
const radius = 38
// Circumference of the circle for stroke-dasharray
const circumference = 2 * Math.PI * radius
// Calculate the percentage of calories consumed relative to the target
const caloriePercentage = computed(() => {
  if (!targets.value.calories) return 0
  return Math.min(100, Math.round((logsStore.totalDailyCalories / targets.value.calories) * 100))
})
// Calculate the stroke-dashoffset for the SVG circle to represent the progress visually
const strokeDashoffset = computed(() => {
  const progress = caloriePercentage.value / 100
  return circumference * (1 - progress)
})

// Macro Progress Percentages
const proteinPercentage = computed(() =>
  Math.min(100, Math.round((logsStore.totalDailyProtein / targets.value.protein) * 100))
)
const carbsPercentage = computed(() =>
  Math.min(100, Math.round((logsStore.totalDailyCarbs / targets.value.carbs) * 100))
)
const fatsPercentage = computed(() =>
  Math.min(100, Math.round((logsStore.totalDailyFats / targets.value.fats) * 100))
)

onMounted(() => {
  if (logsStore.selectedDate) {
    logsStore.fetchCalendarByDate(logsStore.selectedDate)
  }
})
// Watch for changes in the selected date and fetch the corresponding calendar data
watch(
  () => logsStore.selectedDate,
  (newDate) => {
    if (newDate) {
      logsStore.fetchCalendarByDate(newDate)
    }
  }
)
</script>

<template>
  <div class="rounded-2xl border border-surface-border bg-surface p-4 sm:p-5 min-w-0">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-sm sm:text-base font-bold text-white">Macro Progress</h3>
        <p class="text-[11px] text-zinc-400">
          Target adjusted for {{ plannedExercises.length }} planned workout(s)
        </p>
      </div>
      <span class="text-xs text-zinc-400">{{ logsStore.selectedDate }}</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
      <!-- Circular Progress Ring (Calories) -->
      <div class="sm:col-span-5 flex flex-col items-center justify-center relative">
        <div class="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
          <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <!-- Background Track -->
            <circle cx="50" cy="50" :r="radius" class="stroke-background/80" stroke-width="8" fill="transparent"/>
            <!-- Animated Progress Bar -->
            <circle cx="50" cy="50" :r="radius" class="stroke-amber-400 transition-all duration-500 ease-out"
              stroke-width="8" stroke-linecap="round" fill="transparent"
              :stroke-dasharray="circumference" :stroke-dashoffset="strokeDashoffset" />
          </svg>

          <!-- Center Calorie Text -->
          <div class="absolute flex flex-col items-center justify-center text-center">
            <span class="text-lg sm:text-xl font-extrabold text-white leading-none">
              {{ logsStore.totalDailyCalories }}
            </span>
            <span class="text-[10px] text-zinc-400 mt-0.5">/ {{ targets.calories }} kcal</span>
            <span class="text-[10px] font-semibold text-amber-400 mt-0.5">
              {{ caloriePercentage }}%
            </span>
          </div>
        </div>
        <span class="mt-1 text-[11px] font-medium text-zinc-300">Calories</span>
      </div>

      <!-- Macro Bar Breakdown -->
      <div class="sm:col-span-7 space-y-3">
        <!-- Protein -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-rose-400">Protein</span>
            <span class="text-zinc-400 text-[11px]">
              <strong class="text-white">{{ logsStore.totalDailyProtein }}g</strong> / {{ targets.protein }}g
            </span>
          </div>
          <div class="h-2 w-full rounded-full bg-background/60 overflow-hidden">
            <div class="h-full bg-rose-400 transition-all duration-500 rounded-full"
              :style="{ width: `${proteinPercentage}%` }" />
          </div>
        </div>

        <!-- Carbs -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-sky-400">Carbs</span>
            <span class="text-zinc-400 text-[11px]">
              <strong class="text-white">{{ logsStore.totalDailyCarbs }}g</strong> / {{ targets.carbs }}g
            </span>
          </div>
          <div class="h-2 w-full rounded-full bg-background/60 overflow-hidden">
            <div class="h-full bg-sky-400 transition-all duration-500 rounded-full"
              :style="{ width: `${carbsPercentage}%` }" />
          </div>
        </div>

        <!-- Fats -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-emerald-400">Fats</span>
            <span class="text-zinc-400 text-[11px]">
              <strong class="text-white">{{ logsStore.totalDailyFats }}g</strong> / {{ targets.fats }}g
            </span>
          </div>
          <div class="h-2 w-full rounded-full bg-background/60 overflow-hidden">
            <div class="h-full bg-emerald-400 transition-all duration-500 rounded-full"
              :style="{ width: `${fatsPercentage}%` }"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>