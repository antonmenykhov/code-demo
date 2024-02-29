import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRequestStore } from './request.store'

export const useLoadingState = defineStore('loadingState', () => {
  const routerLoading = ref(false)
  const manualLoading = ref(false)
  const requestingStore = useRequestStore()
  const isLoading = computed(
    () => routerLoading.value || requestingStore.debouncedIsFetching || manualLoading.value
  )
  function setManualLoading(newVal: boolean) {
    manualLoading.value = newVal
  }
  return { routerLoading, isLoading, manualLoading, setManualLoading }
})
