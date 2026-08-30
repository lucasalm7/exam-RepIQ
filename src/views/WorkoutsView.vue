<script setup>
import { ref } from 'vue'
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar.vue'
import CombinedTimeline from '@/components/calendar/CombinedTimeline.vue'
import ActivityModal from '@/components/calendar/ActivityModal.vue'
import MuscleHeatmap from '@/components/overview/MuscleHeatmap.vue'

const showActivityModal = ref(false)
const activeTab = ref('calendar') // 'calendar' | 'timeline'
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex gap-2 bg-surface p-1 rounded-xl border border-surface-border text-xs">
        <button 
          @click="activeTab = 'calendar'"
          :class="['px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer', activeTab === 'calendar' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white']"
        >Calendar</button>
        <button 
          @click="activeTab = 'timeline'"
          :class="['px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer', activeTab === 'timeline' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white']"
        >Timeline</button>
      </div>

      <button 
        @click="showActivityModal = true" 
        class="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
      >+ Log Session</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <WeeklyCalendar v-if="activeTab === 'calendar'" />
        <CombinedTimeline v-else />
      </div>
      <div>
        <MuscleHeatmap />
      </div>
    </div>

    <ActivityModal v-if="showActivityModal" @close="showActivityModal = false" />
  </div>
</template>