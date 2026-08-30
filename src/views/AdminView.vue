<script setup>
import { ref } from 'vue'
import ExerciseTable from '@/components/admin/ExerciseTable.vue'
import MealTable from '@/components/admin/MealTable.vue'
import ExerciseFormModal from '@/components/admin/ExerciseFormModal.vue'
import MealFormModal from '@/components/admin/MealFormModal.vue'

const activeTab = ref('exercises') // 'exercises' | 'meals'
const showExerciseModal = ref(false)
const showMealModal = ref(false)
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex gap-2 bg-surface p-1 rounded-xl border border-surface-border text-xs">
        <button 
          @click="activeTab = 'exercises'"
          :class="['px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer', activeTab === 'exercises' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white']"
        >Exercises Database</button>
        <button 
          @click="activeTab = 'meals'"
          :class="['px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer', activeTab === 'meals' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white']"
        >Meal Presets</button>
      </div>

      <button 
        @click="activeTab === 'exercises' ? showExerciseModal = true : showMealModal = true"
        class="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
      >+ Add {{ activeTab === 'exercises' ? 'Exercise' : 'Preset' }}</button>
    </div>

    <ExerciseTable v-if="activeTab === 'exercises'" />
    <MealTable v-else />

    <ExerciseFormModal v-if="showExerciseModal" @close="showExerciseModal = false" />
    <MealFormModal v-if="showMealModal" @close="showMealModal = false" />
  </div>
</template>