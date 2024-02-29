import { monthHandbook } from '@/hooks/months'
import { computed, ref } from 'vue'

export type ForceType = { name: 'general' | 'own' | 'sub'; caption: string; cssClass: string }

export default function useTprIndexesTypes() {
  const forceTypes: ForceType[] = [
    { name: 'general', caption: 'Общие', cssClass: 'index-color-blue' },
    { name: 'own', caption: 'Собственные', cssClass: 'index-color-orange' },
    { name: 'sub', caption: 'Субподряд', cssClass: 'index-color-green' }
  ]
  const indexTypes = [
    { name: 'plan_None', caption: 'БП' },
    { name: 'planCp_None', caption: 'КП' },
    { name: 'factPrice_Stage', caption: 'Факт' },
    { name: 'price_Stage', caption: 'Прогноз' },
    //{ name: 'correction_Stage', caption: 'Корректировка' },
    { name: 'econom_None', caption: 'Экономика' },
    { name: 'econombp_None', caption: 'Экономика/БП' },
    { name: 'prognozbp_None', caption: 'Прогноз/БП' },
    { name: 'economprognoz_None', caption: 'Прогноз/Экономика' }
  ]

  const monthHandbookExtended = computed(() => [
    {
      id: 'total',
      name: 'Всего'
    },
    ...monthHandbook.map((month) => ({ id: `${month.id}`, name: month.name }))
  ])

  const choosedForceTypes = ref<string[]>(['general'])
  const choosedIndexTypes = ref<string[]>(['plan_None', 'price_Stage'])
  const choosedMonths = ref<string[]>([
    'total',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12'
  ])

  return {
    forceTypes,
    indexTypes,
    monthHandbookExtended,
    choosedForceTypes,
    choosedIndexTypes,
    choosedMonths
  }
}
