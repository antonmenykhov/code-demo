import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'

export default function departmentColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())
  const department = computed<Column[]>(() => [
    {
      name: 'name',
      columnType: 'string',
      caption: 'Наименование',
      editable: true
    },
    {
      name: 'groupDepartmentId',
      columnType: 'enum',
      caption: 'Группа',
      lookup: {
        handbook: handbooks.value.groupDepartment,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      },
      editable: true,
      width: 250
    },
    {
      name: 'blockDepartmentId',
      columnType: 'enum',
      caption: 'Блок',
      lookup: {
        handbook: handbooks.value.blockDepartment,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      },
      editable: true,
      width: 250
    },
    {
      name: 'curatorDepartmentId',
      columnType: 'enum',
      caption: 'Куратор',
      lookup: {
        handbook: handbooks.value.curatorDepartment,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      },
      editable: true,
      width: 250
    }
  ])
  return { department }
}
