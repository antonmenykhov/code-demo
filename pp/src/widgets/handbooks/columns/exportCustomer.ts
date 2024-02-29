import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'

export default function exportCustomerColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())
  const exportCustomer = computed<Column[]>(() => [
    {
      name: 'organizationId',
      columnType: 'enum',
      caption: 'Контрагент',
      lookup: {
        handbook: handbooks.value.organization,
        displayExpr: 'name',
        valueExpr: 'id',
        idExpr: 'id'
      },
      editable: true
    }
  ])

  return { exportCustomer }
}
