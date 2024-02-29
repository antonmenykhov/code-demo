import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'

export default function industrialBlockColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())
  const industrialBlock = computed<Column[]>(() => [
    {
      name: 'name',
      columnType: 'string',
      caption: 'Наименование',
      editable: true
    },
    {
      name: 'isOther',
      columnType: 'boolean',
      caption: 'Прочие',
      editable: true,
      trueValue: 'Да',
      falseValue: 'Нет'
    },
    {
      name: 'parentId',
      columnType: 'enum',
      caption: 'Родительский блок',
      editable: true,
      lookup: {
        handbook: handbooks.value.industrialBlock,
        valueExpr: 'id',
        displayExpr: 'name',
        idExpr: 'id'
      }
    }
  ])
  return { industrialBlock }
}
