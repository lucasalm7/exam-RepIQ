<script setup>
import { onMounted, ref } from 'vue'
import PresetMealSelector from '@/components/meals/PresetMealSelector.vue'
import UserMealList from '@/components/meals/UserMealList.vue'
import MealFormModal from '@/components/meals/MealFormModal.vue'
import { useMealsStore } from '@/stores/meals'

const mealsStore = useMealsStore()

const showMealForm = ref(false)
const selectedMeal = ref(null)
const editingMeal = ref(null)

function handleMealSelect(meal) {
  selectedMeal.value = meal
}
//step by step of the function handleMealSubmit:
// 1. The function is declared as an asynchronous function that takes a meal object as an argument.
// 2. Inside a try block, it checks if there is an editingMeal (i.e., if the user is editing an existing meal). If so, it calls the updateUserMeal method from the mealsStore, passing the meal's ID and the updated meal object. If not, it calls the addUserMeal method to add a new meal.
// 3. After successfully adding or updating the meal, it resets the editingMeal to null and hides the meal form by setting showMealForm to false.
// 4. If an error occurs during the add or update process, it catches the error and can display an error message in the modal (though the actual error handling is not implemented
async function handleMealSubmit(meal) {
  try {
    if (editingMeal.value) {
      await mealsStore.updateUserMeal(
        editingMeal.value.$id,
        meal,
      )
    } else {
      await mealsStore.addUserMeal(meal)
    }

    editingMeal.value = null
    showMealForm.value = false
  } catch {
    // display error message in the modal
  }
}
//step by step of the function startEditingMeal:
// 1. The function is declared to take a meal object as an argument.
// 2. It sets the editingMeal ref to the passed meal object, indicating that this meal is currently being edited.
// 3. It sets the showMealForm ref to true, which will trigger the display of the meal form modal for editing or adding a meal.
function startEditingMeal(meal) {
  editingMeal.value = meal
  showMealForm.value = true
}
//step by step of the function closeMealForm:
// 1. The function is declared without any parameters.
// 2. It resets the editingMeal ref to null, indicating that no meal is currently being edited.
// 3. It sets the showMealForm ref to false, which will hide the meal form modal from the user interface.
function closeMealForm() {
  editingMeal.value = null
  showMealForm.value = false
}
//step by step of the function handleDeleteMeal:
// 1. The function is declared as an asynchronous function that takes a mealId as an argument.
// 2. It prompts the user with a confirmation dialog asking if they want to delete the meal. If the user cancels, the function returns early and does nothing.
// 3. If the user confirms, it calls the deleteUserMeal method from the mealsStore, passing the mealId to delete the specified meal from the user's meal list.
async function handleDeleteMeal(mealId) {
  if (!confirm('Delete this meal?')) return

  await mealsStore.deleteUserMeal(mealId)
}

onMounted(() => {
  mealsStore.fetchUserMeals()
})
</script>

<template>
  <div class="space-y-6">
    <header class="border-b border-surface-border pb-6">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"> Meals and nutrition </p>
      <h1 class="mt-2 text-3xl font-bold text-white"> Build your meal log </h1>
      <p class="mt-2 text-sm text-zinc-400"> Choose from verified presets or create meals for your own routine. </p>
    </header>

    <div v-if="mealsStore.error" class="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      {{ mealsStore.error }}
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <!-- Admin-created meals -->
      <section class="space-y-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Verified library
          </p>

          <h2 class="mt-1 text-xl font-bold text-white">
            Preset meals
          </h2>

          <p class="mt-1 text-sm text-zinc-400">
            Meals prepared by the RepIQ team.
          </p>
        </div>

        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] lg:items-start">
          <div class="glass-panel rounded-2xl p-5">
            <PresetMealSelector @select="handleMealSelect" />
          </div>

          <div
            class="rounded-2xl border border-primary/20 bg-primary-muted p-5 lg:sticky lg:top-6"
          >
            <template v-if="selectedMeal">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Meal details
                  </p>

                  <h3 class="mt-1 text-xl font-bold text-white">
                    {{ selectedMeal.name }}
                  </h3>

                  <p class="mt-1 text-sm capitalize text-zinc-300">
                    {{ selectedMeal.category }}
                    ·
                    {{ selectedMeal.servingSize }}
                  </p>
                </div>

                <button
                  type="button"
                  class="text-xs text-zinc-400 hover:text-white"
                  @click="selectedMeal = null"
                >
                  Close
                </button>
              </div>

              <div class="mt-5 grid grid-cols-2 gap-3">
                <div class="rounded-xl bg-background/50 p-3 text-center">
                  <span class="block text-[10px] uppercase text-zinc-500">
                    Calories
                  </span>
                  <strong class="text-sm text-white">
                    {{ selectedMeal.calories }} kcal
                  </strong>
                </div>

                <div class="rounded-xl bg-background/50 p-3 text-center">
                  <span class="block text-[10px] uppercase text-zinc-500">
                    Protein
                  </span>
                  <strong class="text-sm text-white">
                    {{ selectedMeal.protein }}g
                  </strong>
                </div>

                <div class="rounded-xl bg-background/50 p-3 text-center">
                  <span class="block text-[10px] uppercase text-zinc-500">
                    Carbs
                  </span>
                  <strong class="text-sm text-white">
                    {{ selectedMeal.carbs }}g
                  </strong>
                </div>

                <div class="rounded-xl bg-background/50 p-3 text-center">
                  <span class="block text-[10px] uppercase text-zinc-500">
                    Fats
                  </span>
                  <strong class="text-sm text-white">
                    {{ selectedMeal.fats }}g
                  </strong>
                </div>
              </div>

              <div class="mt-5">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Recipe instructions
                </h4>

                <p class="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-300">
                  {{ selectedMeal.instructions || 'No recipe instructions available.' }}
                </p>
              </div>
            </template>

            <div v-else class="flex min-h-56 items-center justify-center text-center">
              <div>
                <p class="text-sm font-semibold text-zinc-300">
                  Select a preset meal
                </p>
                <p class="mt-1 text-xs text-zinc-500">
                  Nutrition and recipe details will appear here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- User-created meals list component -->
      <UserMealList
        :user-meals="mealsStore.userMeals"
        :is-loading="mealsStore.isLoading"
        @add="startEditingMeal(null)"
        @edit="startEditingMeal"
        @delete="handleDeleteMeal"
      />
    </div>

    <MealFormModal v-if="showMealForm" :editing-meal="editingMeal" :is-loading="mealsStore.isLoading" @submit="handleMealSubmit" @close="closeMealForm" />
  </div>
</template>