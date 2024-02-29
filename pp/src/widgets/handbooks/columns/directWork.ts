import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'

export default function directWorkColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())
  const directWork = computed<Column[]>(() => [
    {
      name: 'name',
      columnType: 'string',
      caption: 'Наименование',
      editable: true
    },
    {
      name: 'kindWorkId',
      columnType: 'enum',
      caption: 'Вид работ',
      editable: true,
      lookup: {
        handbook: handbooks.value.kindWork,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      }
    },
    {
      name: 'okved',
      columnType: 'string',
      caption: 'ОКВЭД',
      editable: true
    },
    {
      name: 'it',
      columnType: 'string',
      caption: 'Вид ИТ',
      editable: true
    }
  ])
  return { directWork }
}
