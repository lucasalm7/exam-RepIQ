<script setup>
import { ref } from 'vue'
// Commented out imports to preserve for future use
// import GoalCard from '@/components/goals/GoalCard.vue'
// import GoalFormModal from '@/components/goals/GoalFormModal.vue'

// const showGoalModal = ref(false)
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
    <!-- Maintenance Icon Container -->
    <div class="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h1V4a2 2 0 114 0v1h2V4zM4 14h16M4 18h16" />
      </svg>
    </div>

    <!-- Maintenance Message -->
    <div class="max-w-md space-y-2">
      <h2 class="text-xl font-bold text-white">Feature Under Maintenance</h2>
      <p class="text-xs text-zinc-400 leading-relaxed">
        Goal tracking, strength PR milestones, and cardio targets are currently undergoing scheduled updates. Check back soon for expanded functionality!
      </p>
    </div>

    <!-- Status Badge -->
    <div class="pt-2">
      <span class="px-3 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
        Coming Soon
      </span>
    </div>
  </div>
</template>