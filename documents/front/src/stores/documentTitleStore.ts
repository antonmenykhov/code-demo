import { computed, ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useNotificationStore } from './notificationStore'

export const useDocumentTitleStore = defineStore('documentTitleStore', () => {
  const currentPageName = ref('Документы')
  const { counts } = storeToRefs(useNotificationStore())
  const documentTitle = computed(() => {
    const totalCount = counts.value.in + counts.value.out
    return totalCount > 0 ? `(${totalCount}) ${currentPageName.value}` : currentPageName.value
  })

  watch(documentTitle, (newVal) => (document.title = newVal))

  return { documentTitle, currentPageName }
})
