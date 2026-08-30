<script setup>
import { ref } from 'vue'
import PresetMealSelector from '@/components/meals/PresetMealSelector.vue'
import AiScannerModal from '@/components/meals/AiScannerModal.vue'
import MealFormModal from '@/components/meals/MealFormModal.vue'
import MealCard from '@/components/meals/MealCard.vue'

const showAiScanner = ref(false)
const showMealForm = ref(false)
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <PresetMealSelector />
      
      <div class="flex gap-3">
        <button 
          @click="showAiScanner = true"
          class="px-3.5 py-2 bg-surface-hover border border-primary/40 text-primary hover:bg-primary/10 text-xs font-semibold rounded-xl transition-all cursor-pointer"
        >📷 AI Vision Scan</button>
        <button 
          @click="showMealForm = true"
          class="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
        >+ Add Meal</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MealCard />
    </div>

    <AiScannerModal v-if="showAiScanner" @close="showAiScanner = false" />
    <MealFormModal v-if="showMealForm" @close="showMealForm = false" />
  </div>
</template>