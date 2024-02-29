import { computed, watch, type Ref } from 'vue'
import type SettingsManaging from '@/components/general/SettingsManaging.vue'
import type { TableSettings } from 'tnnc-ui-kit'

export type TprOtherSettings = {
  selectedErrorFilterOption: string
  choosedBlocks: number[]
  choosedMonths: string[]
  choosedForceTypes: string[]
  choosedIndexTypes: string[]
  growingRange: number[]
}

export default function useTprSettings(
  settingsManaging: Ref<InstanceType<typeof SettingsManaging> | undefined>,
  selectedErrorFilterOption: Ref<string>,
  choosedBlocks: Ref<number[]>,
  choosedMonths: Ref<string[]>,
  choosedForceTypes: Ref<string[]>,
  choosedIndexTypes: Ref<string[]>,
  growingRange: Ref<number[]>,
  isFullTprShowed: Ref<boolean>
) {
  function saveSettingsFromTable(tableSettings: TableSettings) {
    if (settingsManaging.value) return settingsManaging.value.saveCurrentSettings({ tableSettings })
  }
  function saveOtherSettings() {
    if (settingsManaging.value)
      return settingsManaging.value.saveCurrentSettings<TprOtherSettings>(otherSettings.value)
  }

  const otherSettings = computed(() => ({
    otherSettings: {
      selectedErrorFilterOption: selectedErrorFilterOption.value,
      choosedBlocks: choosedBlocks.value,
      choosedMonths: choosedMonths.value,
      choosedForceTypes: choosedForceTypes.value,
      choosedIndexTypes: choosedIndexTypes.value,
      growingRange: growingRange.value
    }
  }))

  watch(otherSettings, saveOtherSettings)

  function instanceOfTprOtherSettings(object: any): object is TprOtherSettings {
    return 'choosedBlocks' in object
  }

  function restoreOtherSettings<T = TprOtherSettings>(settings: {
    otherSettings: T
    tableSettings: TableSettings
    isNew?: boolean
  }) {
    if (instanceOfTprOtherSettings(settings.otherSettings)) {
      selectedErrorFilterOption.value = settings.otherSettings.selectedErrorFilterOption
      choosedBlocks.value = settings.otherSettings.choosedBlocks
      choosedMonths.value = settings.otherSettings.choosedMonths
      choosedForceTypes.value = settings.otherSettings.choosedForceTypes
      choosedIndexTypes.value = settings.otherSettings.choosedIndexTypes
      growingRange.value = settings.otherSettings.growingRange
    }
  }

  const settingsResource = computed(() => (isFullTprShowed.value ? 'newTprFull' : 'newTprTiny'))

  return { saveSettingsFromTable, saveOtherSettings, restoreOtherSettings, settingsResource }
}
