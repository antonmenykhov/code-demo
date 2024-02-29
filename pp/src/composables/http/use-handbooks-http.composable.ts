import { supp_url } from '@/config/urls'
import useHttp from './use-http.composable'
import type { TprHandbook } from '../../widgets/handbooks/composables/useHandbooks.composable'

export default function useHandbooksHttp() {
  const { http } = useHttp()

  async function getSuppHandbooksByArrayOfNames(handbookNames: string[]) {
    return http.get<[TprHandbook]>(
      `${supp_url}/report2/directory/options={${handbookNames.join(',')}}`
    )
  }

  async function getOneSuppHandbook<T>(name: string) {
    return http.get<T>(`${supp_url}/${name}`)
  }

  async function createSuppHandbookItem<T, K = T>(handbookName: keyof TprHandbook, payload: K) {
    return http.post<T>(`${supp_url}/${handbookName}`, payload)
  }

  async function updateSuppHandbookItem<T, K = T>(handbookName: keyof TprHandbook, payload: K) {
    return http.put<T>(`${supp_url}/${handbookName}`, payload)
  }

  async function deleteSuppHandbookItem<T, K = T>(handbookName: keyof TprHandbook, payload: K) {
    return http.delete<string>(`${supp_url}/${handbookName}`, { data: payload })
  }

  return {
    getSuppHandbooksByArrayOfNames,
    getOneSuppHandbook,
    createSuppHandbookItem,
    updateSuppHandbookItem,
    deleteSuppHandbookItem
  }
}
