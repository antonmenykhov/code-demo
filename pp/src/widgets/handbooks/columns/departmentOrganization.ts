import type { Column } from 'tnnc-ui-kit'

const departmentOrganization: Column[] = [
  {
    name: 'name',
    columnType: 'string',
    caption: 'Наименование',
    editable: true
  },
  {
    name: 'fullName',
    columnType: 'string',
    caption: 'Полное название',
    editable: true,
    width: 902
  }
]
export { departmentOrganization }
