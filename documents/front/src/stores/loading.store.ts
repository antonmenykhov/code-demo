import { useDebounce } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useLoadingStore = defineStore('loadingStore', () => {
  const isManualLoading = ref(false)
  const requestCount = ref(0)

  const debouncedRequestCount = useDebounce(requestCount, 100)
  const isLoading = computed(() => isManualLoading.value || debouncedRequestCount.value > 0)

  return { isManualLoading, isLoading, requestCount }
})
