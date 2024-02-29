import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { requestStore } from './request.store'

export const loadingState = defineStore('loadingState', () => {
  const routerLoading = ref(false)
  const manualLoading = ref(false)
  const requestingStore = requestStore()
  const isLoading = computed(
    () => routerLoading.value || requestingStore.debouncedIsFetching || manualLoading.value
  )

  return { routerLoading, isLoading, manualLoading }
})
