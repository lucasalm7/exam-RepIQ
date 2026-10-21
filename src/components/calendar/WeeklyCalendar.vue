<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useLogsStore } from '@/stores/logs'
import CalendarExercises from './CalendarExercises.vue'
import CalendarMeals from './CalendarMeals.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'

const logsStore = useLogsStore()

const selectedDate = ref(new Date().toISOString().split('T')[0])
const currentWeekOffset = ref(0)
const showExerciseModal = ref(false)
const showMealModal = ref(false)

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

function loadWeekOverview() {
  const dates = weekDays.value.map(d => d.dateString)
  logsStore.fetchWeeklyOverview(dates)
}

function changeWeek(offsetDelta) {
  currentWeekOffset.value = offsetDelta === 0 ? 0 : currentWeekOffset.value + offsetDelta
  const newMonday = weekDays.value[0].dateString
  selectDay(newMonday)
  loadWeekOverview()
}

function selectDay(dateString) {
  selectedDate.value = dateString
  logsStore.fetchCalendarByDate(dateString)
}

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

async function handleDeleteItem(documentId) {
  await logsStore.removeFromCalendar(documentId)
}

const loggedExercises = computed(() =>
  logsStore.dailyCalendarItems.filter(item => item.type === 'exercise')
)

const loggedMeals = computed(() =>
  logsStore.dailyCalendarItems.filter(item => item.type === 'meal')
)

onMounted(() => {
  logsStore.fetchCalendarByDate(selectedDate.value)
  loadWeekOverview()
})

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
        <button
          type="button"
          class="rounded-lg px-2.5 py-1 text-xs text-zinc-400 hover:bg-surface-hover hover:text-white transition"
          @click="changeWeek(-1)"
        >
          ‹ Prev
        </button>
        <button
          v-if="currentWeekOffset !== 0"
          type="button"
          class="rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-surface-hover transition"
          @click="changeWeek(0)"
        >
          Today
        </button>
        <button
          type="button"
          class="rounded-lg px-2.5 py-1 text-xs text-zinc-400 hover:bg-surface-hover hover:text-white transition"
          @click="changeWeek(1)"
        >
          Next ›
        </button>
      </div>
    </div>

    <!-- Week Strip with Indicator Dots -->
    <div class="grid grid-cols-7 gap-2">
      <button
        v-for="day in weekDays"
        :key="day.dateString"
        type="button"
        class="relative flex flex-col items-center rounded-xl border p-3 transition"
        :class="[
          selectedDate === day.dateString
            ? 'border-primary bg-primary/20 text-white'
            : 'border-surface-border bg-background/40 text-zinc-400 hover:border-primary/50',
          day.isToday ? 'ring-1 ring-primary' : ''
        ]"
        @click="selectDay(day.dateString)"
      >
        <span class="text-[10px] uppercase tracking-wider">{{ day.dayName }}</span>
        <span class="mt-1 text-base font-bold text-white">{{ day.dayNumber }}</span>

        <!-- Indicator Dots -->
        <div class="mt-1.5 flex h-1.5 items-center justify-center gap-1">
          <span
            v-if="logsStore.weeklyOverviewMap[day.dateString]?.hasExercise"
            class="h-1.5 w-1.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500"
            title="Workout planned"
          />
          <span
            v-if="logsStore.weeklyOverviewMap[day.dateString]?.hasMeal"
            class="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500"
            title="Meal planned"
          />
        </div>
      </button>
    </div>

    <!-- Add Buttons -->
    <div class="flex gap-3">
      <button
        type="button"
        class="flex-1 rounded-xl bg-primary/10 border border-primary/30 py-2.5 text-xs font-semibold text-primary hover:bg-primary/20"
        @click="showExerciseModal = true"
      >
        + Add Exercise
      </button>
      <button
        type="button"
        class="flex-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
        @click="showMealModal = true"
      >
        + Add Meal
      </button>
    </div>

    <!-- Daily Log Feed -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div v-if="logsStore.isLoading" class="py-12 flex justify-center">
        <LoadingSpinner text="Loading calendar schedule..." />
      </div>
      <!-- Exercises -->
      <div class="rounded-xl border border-surface-border bg-background/30 p-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Logged Workouts</h3>
        <p v-if="loggedExercises.length === 0" class="text-xs text-zinc-500">No exercises logged for this day.</p>
        <ul v-else class="space-y-2">
          <li
            v-for="item in loggedExercises"
            :key="item.$id"
            class="flex items-center justify-between rounded-lg bg-surface/50 p-2.5 text-xs text-zinc-200"
          >
            <div>
              <span class="font-medium text-white">{{ item.itemName }}</span>
              <span class="ml-2 rounded bg-surface-border/40 px-1.5 py-0.5 text-[10px] text-zinc-400">{{ item.sourceType }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-zinc-400">
                {{ item.parsedDetails.sets }}x{{ item.parsedDetails.reps }} @ {{ item.parsedDetails.weight }}kg
              </span>
              <button
                type="button"
                class="text-zinc-500 hover:text-red-400 transition"
                title="Delete entry"
                @click="handleDeleteItem(item.$id)"
              >
                ✕
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Meals -->
      <div class="rounded-xl border border-surface-border bg-background/30 p-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Logged Meals</h3>
        <p v-if="loggedMeals.length === 0" class="text-xs text-zinc-500">No meals logged for this day.</p>
        <ul v-else class="space-y-2">
          <li
            v-for="item in loggedMeals"
            :key="item.$id"
            class="flex items-center justify-between rounded-lg bg-surface/50 p-2.5 text-xs text-zinc-200"
          >
            <div>
              <span class="font-medium text-white">{{ item.itemName }}</span>
              <span class="ml-2 rounded bg-surface-border/40 px-1.5 py-0.5 text-[10px] text-zinc-400">{{ item.sourceType }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-zinc-400">
                {{ item.parsedDetails.calories }} kcal
              </span>
              <button
                type="button"
                class="text-zinc-500 hover:text-red-400 transition"
                title="Delete entry"
                @click="handleDeleteItem(item.$id)"
              >
                ✕
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modals -->
    <CalendarExercises v-if="showExerciseModal" @select="handleAddItem" @close="showExerciseModal = false" />
    <CalendarMeals v-if="showMealModal" @select="handleAddItem" @close="showMealModal = false" />
  </div>
</template>