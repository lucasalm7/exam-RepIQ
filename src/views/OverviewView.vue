<script setup>
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar.vue'
import MacroRingChart from '@/components/overview/MacroRingChart.vue';
import MuscleHeatmap from '@/components/overview/MuscleHeatmap.vue'
</script>

<template>
  <div class="space-y-6 p-6">
    <h1 class="text-2xl font-bold text-white">Overview</h1>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3">
      <div class="col-span-1 sm:col-span-2 lg:col-span-2">
        <WeeklyCalendar />
      </div>
      <div class="col-span-1">
        <MuscleHeatmap />
      </div>
      <div class="col-span-1">
        <MacroRingChart />
      </div>
    </div>
  </div>
</template>