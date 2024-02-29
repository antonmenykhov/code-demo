import { useHandbookStore } from '@/store/handbooks.store'
import { storeToRefs } from 'pinia'
import type { Column } from 'tnnc-ui-kit'
import { computed } from 'vue'
import ColorPickerCell from '@/components/handbooks/ColorPickerCell.vue'

export default function reportEconomicSectionColumns() {
  const { handbooks } = storeToRefs(useHandbookStore())

  const reportEconomicSection = computed<Column[]>(() => [
    {
      name: 'nameSection',
      columnType: 'string',
      caption: 'Наименование',
      editable: true
    },
    {
      name: 'orderRow',
      columnType: 'number',
      caption: 'Порядковый номер',
      editable: true,
      width: 70
    },
    {
      name: 'level',
      columnType: 'number',
      caption: 'Величина отступа',
      editable: true,
      width: 70
    },
    {
      name: 'codeSection',
      columnType: 'string',
      caption: 'Код',
      editable: true,
      width: 200
    },

    {
      name: 'codeEconomica',
      columnType: 'string',
      caption: 'Код экономика',
      editable: true,
      width: 200
    },
    {
      name: 'color',
      columnType: 'string',
      templating: {
        editor: ColorPickerCell,
        cell: ColorPickerCell
      },
      caption: 'Цвет',
      editable: true,
      width: 200
    },

    {
      name: 'organizationId',
      columnType: 'enum',
      caption: 'Организация',
      editable: true,
      lookup: {
        handbook: handbooks.value.organization,
        valueExpr: 'id',
        displayExpr: 'name',
        idExpr: 'id'
      },
      width: 200
    },
    {
      name: 'industrialBlockId',
      columnType: 'enum',
      caption: 'Производственный блок',
      editable: true,
      lookup: {
        handbook: handbooks.value.industrialBlock,
        valueExpr: 'id',
        displayExpr: 'name',
        idExpr: 'id'
      },
      width: 200
    }
  ])
  return { reportEconomicSection }
}
