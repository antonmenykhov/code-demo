import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { computed, ref, type ComputedRef } from 'vue'

export default function useCardEditing(
  choosedRow: ComputedRef<TprStandart | null>,
  vibrateElementByQuerySelector: (selector: string) => void,
  year: ComputedRef<number>,
  indexTypes: {
    name: string
    caption: string
  }[]
) {
  const changes = ref<{ field: keyof TprStandart; value: TprStandart[keyof TprStandart] }[]>([])

  function setChange<K extends keyof TprStandart, T extends TprStandart[K]>(change: {
    field: K
    value: T
  }) {
    checkAndflushStatusComment(change.field, `${change.value}`)
    checkAndFlushDirectWork(change.field)
    const existIndex = changes.value.findIndex((item) => item.field === change.field)
    if (existIndex !== -1) changes.value.splice(existIndex, 1)
    changes.value.push({ field: change.field, value: change.value })
  }

  function revertAction() {
    changes.value.pop()
  }

  const changedRow = computed(() => {
    if (!choosedRow.value) return null
    const row: TprStandart = { ...choosedRow.value }
    changes.value.forEach((change) => {
      ;(row[change.field] as TprStandart[keyof TprStandart]) = change.value
    })
    return row
  })

  function checkAndflushStatusComment(field: keyof TprStandart, value: string) {
    if (changedRow.value && field === 'statusCalendarPlan_None') {
      if (changedRow.value[field] !== value) {
        setChange({ field: 'status_CommentBlock', value: '' })
        vibrateElementByQuerySelector('.status_CommentBlock')
      }
    }
  }
  function checkAndFlushDirectWork(field: keyof TprStandart) {
    if (field === 'kindWork_Business_Project') {
      setChange({ field: 'directWork_Business_Project', value: '' })
      vibrateElementByQuerySelector('.directWork_Business_Project')
    }
  }

  const deleteButtonState = computed<{ allow: boolean; reason: string }>(() => {
    if (year.value !== new Date().getFullYear())
      return { allow: false, reason: 'Нельзя удалить ТПР в году отличном от текущего' }
    if (
      choosedRow.value &&
      Object.keys(choosedRow.value).some(
        (key) =>
          indexTypes.find((type) => key.includes(type.name)) &&
          choosedRow.value &&
          choosedRow.value[key as keyof TprStandart] !== 0 &&
          choosedRow.value[key as keyof TprStandart] !== null
      )
    )
      return { allow: false, reason: 'Нельзя удалить ТПР, у которого есть показатели' }

    if (choosedRow.value && choosedRow.value.uniqueIdNumberOfYear_NumberCalendarPlanOfYear) {
      return { allow: false, reason: 'Нельзя удалить ТПР, у которого есть УИН' }
    }
    if (
      choosedRow.value &&
      choosedRow.value.genwork_CalendarPlan &&
      choosedRow.value.subs &&
      choosedRow.value.subs.length
    ) {
      return { allow: false, reason: 'Нельзя удалить генподряд у которого есть субподряд' }
    }
    if (choosedRow.value && choosedRow.value.connection) {
      return { allow: false, reason: 'Нельзя удалить ТПР, у которого есть связь с договором' }
    }
    return { allow: true, reason: 'Удалить строку' }
  })

  const hasChanges = computed(() => changes.value.length > 0)

  return { setChange, revertAction, changedRow, changes, deleteButtonState, hasChanges }
}
