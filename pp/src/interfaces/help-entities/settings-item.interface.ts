import type { TableSettings } from 'tnnc-ui-kit'

export interface SettingsItem<T = any> {
  id: number
  userId: string
  name: string
  resource: string
  settings: {
    tableSettings: TableSettings
    otherSettings: T
    isNew?: boolean
  }
}

export type SettingsItemTiny = Omit<SettingsItem, 'settings'>
