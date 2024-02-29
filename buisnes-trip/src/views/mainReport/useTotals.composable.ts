import { parseFormatedValue, formatNumberValue } from '@/hooks/format.hook'
import type { TableRow, TableTotal } from '@tnnc/tnnc-ui-kit'

export default function useTotals() {
  const totals: TableTotal[] = [
    {
      name: 'Итого',
      function(column, rows, ed, razryd) {
        const sum = rows.reduce((acc, row) => {
          const value =
            column.columnType === 'computed'
              ? parseFormatedValue(row[column.name] as string)
              : (row['_rawRow'] as TableRow)[column.name]
          if (value && !isNaN(+value)) acc += +value
          return acc
        }, 0)
        return column.columnType === 'computed' &&
          column.name !== 'exp_year_plan_price_growing_total' &&
          column.name !== 'exp_year_prog_price_growing_total' &&
          column.name !== 'exp_year_growing_deviation'
          ? `${sum}`
          : formatNumberValue(sum, ed, razryd)
      }
    }
  ]

  return { totals }
}
