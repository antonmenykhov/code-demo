import { months } from '@/hooks/months'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
const calcTotalPriceRange = (rowData: TprStandart, growingRange: number[]) => {
  let total = 0
  for (let i = growingRange[0]; i < growingRange[1] + 1; i++) {
    total += rowData.genwork_CalendarPlan
      ? +(rowData[`general_mounth${i}_price_Stage` as keyof TprStandart] || 0)
      : +(rowData[`sub_mounth${i}_price_Stage` as keyof TprStandart] || 0)
  }
  return total
}
const calcTotalPlanCpRange = (rowData: TprStandart, growingRange: number[]) => {
  let total = 0
  for (let i = growingRange[0]; i < growingRange[1] + 1; i++) {
    total += rowData.genwork_CalendarPlan
      ? +(rowData[`general_mounth${i}_planCp_None` as keyof TprStandart] || 0)
      : +(rowData[`sub_mounth${i}_planCp_None` as keyof TprStandart] || 0)
  }
  return total
}
const calcTotalDiffRange = (rowData: TprStandart, growingRange: number[]) => {
  return calcTotalPriceRange(rowData, growingRange) - calcTotalPlanCpRange(rowData, growingRange)
}
const calcTotalGrowHeader = (growingRange: number[]) => {
  return growingRange[1] > 0
    ? `Нарастающий итог Прогноз/КП (${months[0]}-${months[growingRange[1] - 1]})`
    : 'Нарастающий итог(Ни один месяц не закрыт)'
}
export { calcTotalPriceRange, calcTotalPlanCpRange, calcTotalDiffRange, calcTotalGrowHeader }
