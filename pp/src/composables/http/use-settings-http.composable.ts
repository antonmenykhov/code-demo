import { helpservice_url } from '@/config/urls'
import useHttp from './use-http.composable'
import type {
  SettingsItemTiny,
  SettingsItem
} from '@/interfaces/help-entities/settings-item.interface'

export default function useSettingsHttp() {
  const { http } = useHttp(true)

  async function getSettingsSetsByResource(resource: string) {
    return http.get<SettingsItemTiny[]>(`${helpservice_url}/settings/resource/${resource}`)
  }

  async function getOneSettingsSet(id: number) {
    return http.get<SettingsItem>(`${helpservice_url}/settings/${id}`)
  }

  async function createNewSettingsSet(settings: SettingsItem, resource: string, name: string) {
    return http.post(`${helpservice_url}/settings/`, {
      ...settings,
      id: undefined,
      userId: undefined,
      resource,
      name
    })
  }

  async function updateSettingsSet(id: number, settings: SettingsItem) {
    return http.put(`${helpservice_url}/settings/${id}`, {
      settings: settings.settings
    })
  }

  return { getSettingsSetsByResource, getOneSettingsSet, createNewSettingsSet, updateSettingsSet }
}
