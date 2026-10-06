<script setup>
import { computed, onMounted, ref } from 'vue'
import { useLogsStore } from '@/stores/logs'
import CalendarExercises from './CalendarExercises.vue'
import CalendarMeals from './CalendarMeals.vue'

const logsStore = useLogsStore()

const selectedDate = ref(new Date().toISOString().split('T')[0])
const showExerciseModal = ref(false)
const showMealModal = ref(false)

const weekDays = computed(() => {
  const now = new Date()
  const currentDay = now.getDay()
  const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay

  const monday = new Date(now)
  monday.setDate(now.getDate() + distanceToMon)

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    const isoDate = day.toISOString().split('T')[0]
    return {
      dateString: isoDate,
      dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: day.getDate(),
      isToday: isoDate === new Date().toISOString().split('T')[0],
    }
  })
})

const loggedExercises = computed(() =>
  logsStore.dailyCalendarItems.filter(item => item.type === 'exercise')
)

const loggedMeals = computed(() =>
  logsStore.dailyCalendarItems.filter(item => item.type === 'meal')
)

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

onMounted(() => {
  logsStore.fetchCalendarByDate(selectedDate.value)
})
</script>

<template>
  <div class="space-y-6 rounded-2xl border border-surface-border bg-surface p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-white">Weekly Calendar</h2>
      <span class="text-xs text-zinc-400">Selected: {{ selectedDate }}</span>
    </div>

    <!-- Week Strip -->
    <div class="grid grid-cols-7 gap-2">
      <button
        v-for="day in weekDays"
        :key="day.dateString"
        type="button"
        class="flex flex-col items-center rounded-xl border p-3 transition"
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
                x
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