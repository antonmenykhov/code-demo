import { months } from '@/hooks/months'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
const calcTotalBPRangeGen = (rowData: TprStandart, growingRange: number[]) => {
  let total = 0
  for (let i = growingRange[0]; i < growingRange[1] + 1; i++) {
    total += +(rowData[`general_mounth${i}_plan_None` as keyof TprStandart] || 0)
  }
  return total
}

const calcTotalBPRangeSub = (rowData: TprStandart, growingRange: number[]) => {
  let total = 0
  for (let i = growingRange[0]; i < growingRange[1] + 1; i++) {
    total += +(rowData[`sub_mounth${i}_plan_None` as keyof TprStandart] || 0)
  }
  return total
}

const calcTotalBPRangeSS = (rowData: TprStandart, growingRange: number[]) => {
  return rowData.genwork_CalendarPlan
    ? calcTotalBPRangeGen(rowData, growingRange) - calcTotalBPRangeSub(rowData, growingRange)
    : 0
}

const calcTotalPrognozRangeGen = (rowData: TprStandart, growingRange: number[]) => {
  let total = 0
  for (let i = growingRange[0]; i < growingRange[1] + 1; i++) {
    total += +(rowData[`general_mounth${i}_price_Stage` as keyof TprStandart] || 0)
  }
  return total
}

const calcTotalPrognozRangeSub = (rowData: TprStandart, growingRange: number[]) => {
  let total = 0
  for (let i = growingRange[0]; i < growingRange[1] + 1; i++) {
    total += +(rowData[`sub_mounth${i}_price_Stage` as keyof TprStandart] || 0)
  }
  return total
}

const calcTotalPrognozRangeSS = (rowData: TprStandart, growingRange: number[]) => {
  return rowData.genwork_CalendarPlan
    ? calcTotalPrognozRangeGen(rowData, growingRange) -
        calcTotalPrognozRangeSub(rowData, growingRange)
    : 0
}

const calcTotalDiffProgBPGen = (rowData: TprStandart, growingRange: number[]) => {
  return (
    calcTotalPrognozRangeGen(rowData, growingRange) - calcTotalBPRangeGen(rowData, growingRange)
  )
}
const calcTotalDiffProgBPSub = (rowData: TprStandart, growingRange: number[]) => {
  return (
    calcTotalPrognozRangeSub(rowData, growingRange) - calcTotalBPRangeSub(rowData, growingRange)
  )
}
const calcTotalDiffProgBPSS = (rowData: TprStandart, growingRange: number[]) => {
  return calcTotalPrognozRangeSS(rowData, growingRange) - calcTotalBPRangeSS(rowData, growingRange)
}
const calcTotalGrowHeaderExtended = (growingRange: number[]) => {
  return growingRange[1] > 0
    ? `Нарастающий итог (${months[0]}-${months[growingRange[1] - 1]})`
    : 'Нарастающий итог(Ни один месяц не закрыт)'
}
export {
  calcTotalBPRangeGen,
  calcTotalBPRangeSub,
  calcTotalBPRangeSS,
  calcTotalPrognozRangeGen,
  calcTotalPrognozRangeSub,
  calcTotalPrognozRangeSS,
  calcTotalDiffProgBPGen,
  calcTotalDiffProgBPSub,
  calcTotalDiffProgBPSS,
  calcTotalGrowHeaderExtended
}
