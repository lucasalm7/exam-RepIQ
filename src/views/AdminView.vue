<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { usePermissions } from '@/composables/usePermissions'
import { useModalState } from '@/composables/useModalState'
import { useAuthStore } from '@/stores/auth'
// we import the components for the exercise and meal management
// these are reused components that handle the display and form modals for exercises and meals
import ExerciseTable from '@/components/workouts/ExerciseTable.vue'
import ExerciseFormModal from '@/components/workouts/ExerciseFormModal.vue'
import MealTable from '@/components/meals/MealTable.vue'
import MealFormModal from '@/components/meals/MealFormModal.vue'
// we import the stores for admin, auth, and permissions
const adminStore = useAdminStore()
const { isAdmin } = usePermissions()
const authStore = useAuthStore()
// we define reactive references for the active tab, search queries, and category filters for exercises and meals
const activeTab = ref('exercises')
const exerciseSearch = ref('')
const exerciseCategoryFilter = ref('all')
const mealSearch = ref('')
const mealCategoryFilter = ref('all')
// we use the useModalState composable to manage the state of the exercise and meal modals
const {
  isOpen: isExerciseModalOpen,
  editingItem: editingExercise,
  open: openExerciseModal,
  close: closeExerciseModal,
} = useModalState()

const {
  isOpen: isMealModalOpen,
  editingItem: editingMeal,
  open: openMealModal,
  close: closeMealModal,
} = useModalState()
// we use onmounted which means that when the component is mounted, we fetch the exercise and meal libraries from the admin store. 
// This ensures that the data is available for display in the tables.
onMounted(async () => {
  await Promise.all([
    adminStore.fetchExerciseLibrary(),
    adminStore.fetchPresetMealLibrary(),
  ])
})
// we define computed properties for filtered exercises and meals based on the search queries and category filters.
const filteredExercises = computed(() => {
  const query = exerciseSearch.value.toLowerCase()

  return adminStore.exerciseLibrary.filter(exercise => {
    const name = (exercise.name || '').toLowerCase()
    const matchesSearch = name.includes(query)
    const matchesCategory =
      exerciseCategoryFilter.value === 'all' ||
      exercise.category === exerciseCategoryFilter.value

    return matchesSearch && matchesCategory
  })
})
// we define a computed property for filtered meals based on the search query and category filter.
const filteredMeals = computed(() => {
  const query = mealSearch.value.toLowerCase()

  return adminStore.presetMealLibrary.filter(meal => {
    const name = (meal.name || '').toLowerCase()
    const matchesSearch = name.includes(query)
    const matchesCategory =
      mealCategoryFilter.value === 'all' ||
      meal.category === mealCategoryFilter.value

    return matchesSearch && matchesCategory
  })
})
// we define an asynchronous function to save an exercise. It checks if we are editing an existing exercise or adding a new one, and calls the appropriate method from the admin store. After saving, it closes the modal.
async function saveExercise(payload) {
  try {
    if (editingExercise.value) {
      await adminStore.updateGlobalExercise(
        editingExercise.value.$id,
        payload,
      )
    } else {
      await adminStore.addGlobalExercise({
        ...payload,
        createdBy: authStore.user?.$id || 'system',
      })
    }

    closeExerciseModal()
  } catch {
    // adminStore.error displays the error
  }
}
// we define an asynchronous function to save a meal. It checks if we are editing an existing meal or adding a new one, and calls the appropriate method from the admin store. After saving, it closes the modal.
async function saveMeal(payload) {
  try {
    if (editingMeal.value) {
      await adminStore.updatePresetMeal(
        editingMeal.value.$id,
        payload,
      )
    } else {
      await adminStore.addPresetMeal({
        ...payload,
        createdBy: authStore.user?.$id || 'system',
      })
    }

    closeMealModal()
  } catch {
    // adminStore.error displays the error
  }
}
// we define asynchronous functions to delete exercises and meals. They prompt the user for confirmation before calling the appropriate delete method from the admin store. If an error occurs, it is displayed via the admin store's error handling.
async function deleteExercise(id) {
  if (!confirm('Are you sure you want to delete this exercise?')) return

  try {
    await adminStore.deleteGlobalExercise(id)
  } catch {
    // adminStore.error displays the error
  }
}
// we define an asynchronous function to delete a meal. It prompts the user for confirmation before calling the deletePresetMeal method from the admin store. If an error occurs, it is displayed via the admin store's error handling.
async function deleteMeal(id) {
  if (!confirm('Are you sure you want to delete this meal?')) return

  try {
    await adminStore.deletePresetMeal(id)
  } catch {
    // adminStore.error displays the error
  }
}
</script>

<template>
  <div class="space-y-6 font-sans">
    <header class="flex flex-col gap-4 border-b border-surface-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"> Staff workspace </p>

        <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl"> Admin management </h1>

        <p class="mt-2 max-w-2xl text-sm text-zinc-400"> Maintain the shared exercise library and verified meal presets. </p>
      </div>

      <div class="rounded-xl border border-accent/20 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent">
        {{ isAdmin ? 'Administrator' : 'Team member' }}
      </div>
    </header>

    <div v-if="adminStore.error" class="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert" >
      {{ adminStore.error }}
    </div>

    <div class="flex gap-1 overflow-x-auto rounded-xl border border-surface-border bg-surface/50 p-1">
      <button type="button" class="shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors" :class="activeTab === 'exercises' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:bg-surface-hover hover:text-white'" @click="activeTab = 'exercises'" >
        Exercises
        <span class="ml-1 text-xs opacity-70">
          {{ adminStore.exerciseLibrary.length }}
        </span>
      </button>

      <button type="button" class="shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors" :class="activeTab === 'meals' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:bg-surface-hover hover:text-white'" @click="activeTab = 'meals'" >
        Meal presets
        <span class="ml-1 text-xs opacity-70">
          {{ adminStore.presetMealLibrary.length }}
        </span>
      </button>
    </div>

    <section v-if="activeTab === 'exercises'" class="space-y-4">
      <div class="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface/40 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-col gap-3 sm:flex-row">
          <input v-model="exerciseSearch" type="search" placeholder="Search exercises..." class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64" />

          <select v-model="exerciseCategoryFilter" class="rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" >
            <option value="all">All categories</option>
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="shoulders">Shoulders</option>
            <option value="arms">Arms</option>
            <option value="core">Core</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>

        <button type="button" class="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover" @click="openExerciseModal()" >
          + Add exercise
        </button>
      </div>

      <ExerciseFormModal
        v-if="isExerciseModalOpen" :editing-exercise="editingExercise" :is-loading="adminStore.isLoading" @submit="saveExercise" @close="closeExerciseModal" />

      <ExerciseTable
        :exercises="filteredExercises" :is-admin="isAdmin" :is-loading="adminStore.isLoading" @edit="openExerciseModal" @delete="deleteExercise" />
    </section>

    <section v-if="activeTab === 'meals'" class="space-y-4">
      <div class="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface/40 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-col gap-3 sm:flex-row">
          <input v-model="mealSearch" type="search" placeholder="Search preset meals..." class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64" />

          <select v-model="mealCategoryFilter" class="rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" >
            <option value="all">All categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <button type="button" class="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover" @click="openMealModal()" >
          + Add preset meal
        </button>
      </div>

      <MealFormModal
        v-if="isMealModalOpen" :editing-meal="editingMeal" :is-loading="adminStore.isLoading" @submit="saveMeal" @close="closeMealModal" />

      <MealTable
        :meals="filteredMeals" :is-admin="isAdmin" :is-loading="adminStore.isLoading" @edit="openMealModal" @delete="deleteMeal" />
    </section>
  </div>
</template>