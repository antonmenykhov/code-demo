import { defineStore } from 'pinia'
import { ref } from 'vue'

export const titleStore = defineStore('titleStore', () => {
  const title = ref('Управление командировочными расходами')

  function setTitle(newTitle?: string) {
    document.title = `${window.location.hostname === '10.28.70.23' ? '[ТЕСТ]' : ''} ${
      newTitle || ''
    } | Управление командировочными расходами`
    title.value = newTitle || 'Управление командировочными расходами'
  }

  return { setTitle, title }
})
