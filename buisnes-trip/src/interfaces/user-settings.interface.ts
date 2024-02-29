import type { TableSettings } from '@tnnc/tnnc-ui-kit'

export interface UserSettings {
  id: number
  interface_table_name: string
  is_common: boolean
  settings_values: string
  username: string
}

export type UserSettingsFormated = Omit<UserSettings, 'settings_values'> & {
  settings_values: UserSettingsFormat
}

export interface UserSettingsFormat {
  settings: TableSettings
  settingsName: string
}
