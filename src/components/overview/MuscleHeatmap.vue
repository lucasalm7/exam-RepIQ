<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
import { Query } from 'appwrite'
import { useAuthStore } from '@/stores/auth'
import { useCalendarExercises } from '@/composables/useCalendarSelectors'

const authStore = useAuthStore()
const { allExercises, loadAllExercises } = useCalendarExercises()

const isLoading = ref(false)
const weeklyCategories = ref(new Set())

// Get current 7-day week date strings (YYYY-MM-DD)
const currentWeekDates = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  const monday = new Date(now)
  monday.setDate(now.getDate() + distanceToMon)

  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
})

// Fetch logged workouts for the current week and map categories
async function fetchWeeklyTargetedMuscles() {
  const userId = authStore.userProfile?.$id || authStore.user?.$id
  if (!userId) return

  isLoading.value = true
  weeklyCategories.value.clear()

  try {
    // 1. Ensure exercise library is populated for category lookup
    if (allExercises.value.length === 0) {
      await loadAllExercises()
    }

    // Map exercise $id -> category for fast lookup
    const categoryMap = new Map()
    allExercises.value.forEach(ex => {
      if (ex.$id && ex.category) {
        categoryMap.set(ex.$id, ex.category.toLowerCase())
      }
    })

    // 2. Fetch calendar logs across the week
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CALENDAR,
      [
        Query.equal('userId', userId),
        Query.equal('type', 'exercise'),
        Query.equal('date', currentWeekDates.value),
      ]
    )

    // 3. Collect active categories
    const activeSet = new Set()
    response.documents.forEach(doc => {
      // Check direct lookup from loaded exercises library
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

// Helpers to check if a category is active this week
const isChestActive = computed(() => weeklyCategories.value.has('chest'))
const isBackActive = computed(() => weeklyCategories.value.has('back'))
const isLegsActive = computed(() => weeklyCategories.value.has('legs'))
const isShouldersActive = computed(() => weeklyCategories.value.has('shoulders'))
const isArmsActive = computed(() => weeklyCategories.value.has('arms'))
const isCoreActive = computed(() => weeklyCategories.value.has('core'))

onMounted(() => {
  fetchWeeklyTargetedMuscles()
})

// Re-fetch if auth state initializes
watch(() => authStore.user?.$id, () => {
  fetchWeeklyTargetedMuscles()
})
</script>

<template>
  <div class="rounded-2xl border border-surface-border bg-surface p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-bold text-white">Targeted Muscles</h3>
        <p class="text-xs text-zinc-400">Muscle groups hit during the active week</p>
      </div>
      <button 
        type="button" 
        class="text-xs text-primary hover:underline"
        @click="fetchWeeklyTargetedMuscles"
      >
        Refresh
      </button>
    </div>

    <!-- Heatmap Body SVG Display -->
    <div class="relative flex justify-center items-center py-4 min-h-[220px]">
      <div v-if="isLoading" class="text-xs text-zinc-500">
        Loading muscle engagement...
      </div>

      <div v-else class="flex gap-8 items-center justify-center">
        <!-- Front View -->
        <div class="flex flex-col items-center">
          <span class="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Front View</span>
          <svg viewBox="0 0 100 200" class="w-28 h-52 stroke-zinc-900 stroke-[0.5] transition-all">
          
            <!-- Head -->
            <ellipse cx="50" cy="22" rx="10" ry="12" fill="#27272a" />

            <!-- Shoulders (Front) -->
            <path 
              d="M 28 38 Q 22 42 21 52 L 28 50 Z M 72 38 Q 78 42 79 52 L 72 50 Z" 
              :class="isShouldersActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />

            <!-- Chest -->
            <path 
              d="M 34 45 Q 50 43 66 45 L 64 62 Q 50 66 36 62 Z" 
              :class="isChestActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />

            <!-- Arms (Biceps/Forearms) -->
            <path 
              d="M 20 54 Q 16 68 18 85 L 24 85 Q 26 68 26 52 Z M 80 54 Q 84 68 82 85 L 76 85 Q 74 68 74 52 Z" 
              :class="isArmsActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />

            <!-- Core (Abs) -->
            <path 
              d="M 37 66 Q 50 66 63 66 L 61 96 Q 50 98 39 96 Z" 
              :class="isCoreActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />

            <!-- Legs (Quads) -->
            <path 
              d="M 30 102 Q 48 102 48 145 L 34 145 Q 28 122 30 102 Z M 70 102 Q 52 102 52 145 L 66 145 Q 72 122 70 102 Z" 
              :class="isLegsActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />
            <!-- Calves (Front) -->
            <path 
              d="M 34 148 L 46 148 L 42 182 L 32 182 Z M 66 148 L 54 148 L 58 182 L 68 182 Z" 
              :class="isLegsActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />
          </svg>
        </div>

        <!-- Back View -->
        <div class="flex flex-col items-center">
          <span class="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Back View</span>
          <svg viewBox="0 0 100 200" class="w-28 h-52 stroke-zinc-900 stroke-[0.5] transition-all">
            <!-- Base Body Contour -->
            <path d="M 35 20 Q 50 15 65 20 Q 75 35 80 50 L 82 85 Q 80 100 75 110 L 72 180 Q 68 190 60 190 L 52 190 L 50 110 L 48 190 L 40 190 Q 32 190 28 180 L 25 110 Q 20 100 18 85 L 20 50 Q 25 35 35 20 Z" fill="#18181b" />

            <!-- Head -->
            <ellipse cx="50" cy="22" rx="10" ry="12" fill="#27272a" />

            <!-- Shoulders (Rear Delts / Traps) -->
            <path 
              d="M 32 36 Q 50 30 68 36 L 72 48 Q 50 44 28 48 Z" 
              :class="isShouldersActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />

            <!-- Back (Lats / Upper Back) -->
            <path 
              d="M 30 50 Q 50 46 70 50 L 64 88 Q 50 94 36 88 Z" 
              :class="isBackActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />

            <!-- Arms (Triceps / Forearms Rear) -->
            <path 
              d="M 20 52 Q 16 68 18 85 L 24 85 Q 26 68 26 52 Z M 80 52 Q 84 68 82 85 L 76 85 Q 74 68 74 52 Z" 
              :class="isArmsActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />

            <!-- Glutes (Legs/Lower Back) -->
            <path 
              d="M 34 92 Q 50 90 66 92 L 66 110 Q 50 114 34 110 Z" 
              :class="isLegsActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />

            <!-- Hamstrings & Calves (Rear) -->
            <path 
              d="M 32 113 Q 48 113 46 182 L 32 182 Z M 68 113 Q 52 113 54 182 L 68 182 Z" 
              :class="isLegsActive ? 'fill-primary shadow-lg shadow-primary/50' : 'fill-zinc-800'"
              class="transition-colors duration-300"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Category Indicators Legend -->
    <div class="mt-4 grid grid-cols-3 gap-2 border-t border-surface-border/50 pt-4">
      <div 
        v-for="cat in ['chest', 'back', 'legs', 'shoulders', 'arms', 'core']" 
        :key="cat"
        class="flex items-center gap-2"
      >
        <span 
          class="h-2.5 w-2.5 rounded-full transition-colors"
          :class="weeklyCategories.has(cat) ? 'bg-primary shadow-sm shadow-primary' : 'bg-zinc-700'"
        />
        <span class="text-xs capitalize text-zinc-300">{{ cat }}</span>
      </div>
    </div>
  </div>
</template>