import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { type Column, getNumberFromFormattedValue } from 'tnnc-ui-kit'

function calcTotalGenSub(rows: (TprStandart & { _rawRow: TprStandart })[], column: Column) {
  const genworkSet = new Set<boolean>()
  rows.forEach((row) => genworkSet.add(row._rawRow.genwork_CalendarPlan))
  if (genworkSet.size > 1) {
    if (column.name.toLowerCase().includes('sub')) {
      return rows.reduce((sum, row) => {
        return (sum +=
          !isNaN(getNumberFromFormattedValue(`${row[column.name as keyof TprStandart]}`)) &&
          row._rawRow.genwork_CalendarPlan === false
            ? getNumberFromFormattedValue(`${row[column.name as keyof TprStandart]}`)
            : 0)
      }, 0)
    }
    return rows.reduce((sum, row) => {
      return (sum +=
        !isNaN(getNumberFromFormattedValue(`${row[column.name as keyof TprStandart]}`)) &&
        row._rawRow.genwork_CalendarPlan === true
          ? getNumberFromFormattedValue(`${row[column.name as keyof TprStandart]}`)
          : 0)
    }, 0)
  }
  return rows.reduce((sum, row) => {
    return (sum += !isNaN(getNumberFromFormattedValue(`${row[column.name as keyof TprStandart]}`))
      ? getNumberFromFormattedValue(`${row[column.name as keyof TprStandart]}`)
      : 0)
  }, 0)
}

export { calcTotalGenSub }
