import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useWindowSize } from '@vueuse/core'

export const useModeStore = defineStore('modeStore', () => {
  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < 970)

  return { isMobile }
})
