import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'

export default function kindWorkColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())
  const kindWork = computed<Column[]>(() => [
    {
      name: 'name',
      columnType: 'string',
      caption: 'Наименование',
      editable: true
    },
    {
      name: 'groupKindWorkId',
      columnType: 'enum',
      caption: 'Группа',
      lookup: {
        handbook: handbooks.value.groupKindWork,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      },
      editable: true,
      width: 260
    }
  ])
  return { kindWork }
}
