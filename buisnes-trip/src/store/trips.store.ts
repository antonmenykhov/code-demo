import type { BuisnessTrip } from '@/interfaces/buisness-trip.interface'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const tripStore = defineStore('tripStore', () => {
  const trips = ref<BuisnessTrip[]>([])

  return { trips }
})
