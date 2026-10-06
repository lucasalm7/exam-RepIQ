<script setup>
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar.vue'
import MuscleHeatmap from '@/components/overview/MuscleHeatmap.vue'
</script>

<template>
  <div class="space-y-6 p-6">
    <h1 class="text-2xl font-bold text-white">Overview</h1>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
      <WeeklyCalendar />
      <MuscleHeatmap />
    </div>
  </div>
</template>