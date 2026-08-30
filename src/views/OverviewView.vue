<!-- src/views/OverviewView.vue -->
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="space-y-6 font-sans">
    
    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      <!-- Card 1: Today's Planned Activity -->
      <div class="glass-panel rounded-2xl p-5 hover:border-zinc-700 transition-colors">
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs uppercase tracking-wider font-semibold text-zinc-400">Planned Session</span>
          <span class="text-xs text-primary font-mono font-medium">17:30 TODAY</span>
        </div>
        <h2 class="text-lg font-medium text-white">Push & Abs Routine</h2>
        <p class="text-xs text-zinc-400 mt-1">4 Exercises • Chest, Shoulders, Triceps</p>
        
        <button class="w-full mt-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all cursor-pointer">
          Start Workout
        </button>
      </div>

      <!-- Card 2: Calorie & Macro Target -->
      <div class="glass-panel rounded-2xl p-5 hover:border-zinc-700 transition-colors">
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs uppercase tracking-wider font-semibold text-zinc-400">Daily Macros</span>
          <span class="text-xs text-zinc-400 font-mono">1,840 / 2,400 kcal</span>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full bg-surface-border h-2 rounded-full overflow-hidden mt-2">
          <div class="bg-primary h-full w-[76%] rounded-full"></div>
        </div>

        <div class="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
          <div class="bg-background/60 p-2 rounded-xl border border-surface-border">
            <span class="block text-zinc-400 text-[10px]">PROTEIN</span>
            <span class="font-mono font-semibold text-white">142g</span>
          </div>
          <div class="bg-background/60 p-2 rounded-xl border border-surface-border">
            <span class="block text-zinc-400 text-[10px]">CARBS</span>
            <span class="font-mono font-semibold text-white">180g</span>
          </div>
          <div class="bg-background/60 p-2 rounded-xl border border-surface-border">
            <span class="block text-zinc-400 text-[10px]">FATS</span>
            <span class="font-mono font-semibold text-white">52g</span>
          </div>
        </div>
      </div>

      <!-- Card 3: Active Goal Progress -->
      <div class="glass-panel rounded-2xl p-5 hover:border-zinc-700 transition-colors">
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs uppercase tracking-wider font-semibold text-zinc-400">Active Goal</span>
          <span class="text-xs text-success font-mono font-medium">80% REACHED</span>
        </div>
        <h2 class="text-lg font-medium text-white">100kg Bench Press</h2>
        <p class="text-xs text-zinc-400 mt-1">Current PR: <span class="font-mono text-zinc-200">92.5kg</span></p>

        <div class="w-full bg-surface-border h-2 rounded-full overflow-hidden mt-4">
          <div class="bg-success h-full w-[80%] rounded-full"></div>
        </div>
      </div>

    </div>
  </div>
</template>