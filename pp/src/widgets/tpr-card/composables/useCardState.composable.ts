import type SettingsManagingVue from '@/components/general/SettingsManaging.vue'
import useTprIndexesTypes from '@/composables/useTprIndexesTypes.composable'
import { monthHandbook } from '@/hooks/months'
import { set } from '@vueuse/core'
import type { TableSettings } from 'tnnc-ui-kit'
import { computed, ref, watch, type Ref } from 'vue'

export type TprCardSettings = {
  collapsed: {
    mainAttributes: boolean
    additionalAttributes: boolean
    sudConnection: boolean
    errorsBlock: boolean
    indexesGeneral: boolean
    indexesSub: boolean
    indexesOwn: boolean
    contractInfo: boolean
    factorsGeneral: boolean
    factorsOwn: boolean
    leftSide: boolean
    rightSide: boolean
  }
  choosedForceTypes: string[]
  choosedIndexTypes: string[]
  choosedMonthsTotals: (string | number)[]
  growingRange: number[]
}
export default function useCardState(
  settingsManaging: Ref<undefined | InstanceType<typeof SettingsManagingVue>>
) {
  const collapsed = ref({
    mainAttributes: false,
    additionalAttributes: true,
    sudConnection: true,
    errorsBlock: false,
    indexesGeneral: false,
    indexesSub: false,
    indexesOwn: false,
    contractInfo: false,
    factorsGeneral: false,
    factorsOwn: false,
    leftSide: false,
    rightSide: false
  })

  const { forceTypes, choosedForceTypes, choosedIndexTypes, indexTypes } = useTprIndexesTypes()
  const choosedForceTypesObjects = computed(() =>
    forceTypes.filter((force) => choosedForceTypes.value.includes(force.name))
  )
  const choosedIndexTypesObjects = computed(() =>
    indexTypes.filter((index) => choosedIndexTypes.value.includes(index.name))
  )

  const monthsTotalsHandbook = [
    ...monthHandbook,
    { id: 'total', name: 'Всего' },
    { id: 'growingTotal', name: 'Нар. итог' }
  ]

  const choosedMonthsTotals = ref<(string | number)[]>([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    'total',
    'growingTotal'
  ])

  const growingRange = ref([1, 12])

  const isNumberContractInvalid = ref(false)

  const tprCardSettings = computed<TprCardSettings>(() => ({
    collapsed: collapsed.value,
    growingRange: growingRange.value,
    choosedForceTypes: choosedForceTypes.value,
    choosedIndexTypes: choosedIndexTypes.value,
    choosedMonthsTotals: choosedMonthsTotals.value
  }))

  watch(tprCardSettings, saveSettings)
  watch(collapsed, saveSettings, { deep: true })

  function saveSettings() {
    if (settingsManaging.value)
      settingsManaging.value.saveCurrentSettings({ otherSettings: tprCardSettings.value })
  }

  function isTprCardSettings(obj: any): obj is TprCardSettings {
    return 'choosedMonthsTotals' in obj
  }

  function restoreSettings<T = TprCardSettings>(settings: {
    tableSettings: TableSettings
    otherSettings: T
    isNew?: boolean
  }) {
    if (isTprCardSettings(settings.otherSettings)) {
      choosedForceTypes.value = settings.otherSettings.choosedForceTypes
      choosedIndexTypes.value = settings.otherSettings.choosedIndexTypes
      choosedMonthsTotals.value = settings.otherSettings.choosedMonthsTotals
      growingRange.value = settings.otherSettings.growingRange
      collapsed.value = settings.otherSettings.collapsed
    }
  }

  return {
    collapsed,
    growingRange,
    forceTypes,
    choosedForceTypes,
    choosedIndexTypes,
    indexTypes,
    choosedForceTypesObjects,
    choosedIndexTypesObjects,
    monthsTotalsHandbook,
    choosedMonthsTotals,
    isNumberContractInvalid,
    restoreSettings
  }
}
