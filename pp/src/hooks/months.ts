const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]

const supp_months = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
]

const monthHandbook: { id: number; name: string }[] = months.map((month, index) => {
  const item: { id: number; name: string } = { id: index + 1, name: month }
  return item
})

export { months, supp_months, monthHandbook }
