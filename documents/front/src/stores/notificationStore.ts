import { ref } from 'vue'
import { defineStore } from 'pinia'
import useHttp from '@/composables/useHttp.composable'
import { useRoute } from 'vue-router'

export const useNotificationStore = defineStore('notificationStore', () => {
  const { http } = useHttp()

  const counts = ref({ in: 0, out: 0 })

  async function getDocs() {
    http.get<{ in: number; out: number }>(`/document/counts`).then(({ data }) => {
      counts.value = data
    })
  }

  const route = useRoute()
  setInterval(() => {
    if (!route.path.includes('documents')) getDocs()
  }, 60 * 1000)

  return { counts, getDocs }
})
