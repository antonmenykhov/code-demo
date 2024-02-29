import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'

export default function decodeErrorColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())
  const decodeError = computed<Column[]>(() => [
    {
      name: 'code',
      columnType: 'string',
      caption: 'Код ошибки',
      editable: false
    },
    {
      name: 'level',
      columnType: 'number',
      caption: 'Уровень ошибки',
      editable: true
    },
    {
      name: 'description',
      columnType: 'string',
      caption: 'Описание',
      editable: true
    },
    {
      name: 'resolution',
      columnType: 'string',
      caption: 'Решение',
      editable: true
    },
    {
      name: 'sectionErrorId',
      columnType: 'enum',
      caption: 'Раздел ошибки',
      editable: true,
      lookup: {
        handbook: handbooks.value.sectionError,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      }
    }
  ])

  return { decodeError }
}
