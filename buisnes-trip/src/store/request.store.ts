import { useDebounce } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const requestStore = defineStore('requestStore', () => {
  const requestCounter = ref(0)
  function increment() {
    requestCounter.value++
  }
  function decrement() {
    requestCounter.value--
  }

  const isFetching = computed(() => requestCounter.value > 0)
  const debouncedIsFetching = useDebounce(isFetching, 150)

  return { increment, decrement, isFetching, debouncedIsFetching }
})
