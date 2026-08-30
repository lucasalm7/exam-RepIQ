<script setup>
import { ref } from 'vue'
import GoalCard from '@/components/goals/GoalCard.vue'
import GoalFormModal from '@/components/goals/GoalFormModal.vue'

const showGoalModal = ref(false)
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <p class="text-xs text-zinc-400">Track strength PRs, cardio targets, and physical milestones.</p>
      <button 
        @click="showGoalModal = true"
        class="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
      >+ Set New Goal</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <GoalCard />
    </div>

    <GoalFormModal v-if="showGoalModal" @close="showGoalModal = false" />
  </div>
</template>