import type { Column } from 'tnnc-ui-kit'

const groupKindWork: Column[] = [
  {
    name: 'name',
    columnType: 'string',
    caption: 'Наименование',
    editable: true
  },
  {
    name: 'isGenwork',
    columnType: 'boolean',
    caption: 'Генподряд',
    editable: true,
    trueValue: 'Да',
    falseValue: 'Нет'
  },
  {
    name: 'isSubwork',
    columnType: 'boolean',
    caption: 'Субподряд',
    editable: true,
    trueValue: 'Да',
    falseValue: 'Нет'
  }
]
export { groupKindWork }
