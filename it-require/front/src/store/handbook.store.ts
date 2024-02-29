import type { UserRepresentation } from '@/interfaces/defs/userRepresentation'
import type { Handbook } from '@/interfaces/hadnbook.interface'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHandbookStore = defineStore('handbookStore', () => {
  const questionTypes = ref([
    {
      name: 'Дата',
      value: 'date'
    },
    {
      name: 'Число',
      value: 'number'
    },
    {
      name: 'Строка',
      value: 'string'
    },
    {
      name: 'Справочное значение',
      value: 'handbook'
    }
  ])
  const handbooks = ref<Handbook[]>([])
  const users = ref<UserRepresentation[]>([])
  return { questionTypes, handbooks, users }
})
