import { emp_moderator_url } from '@/config/urls'
import useHttp from './use-http.composable'
import type { SuppSlice } from '@/interfaces/supp-entities/supp-slice.interface'

export default function useSuppSlicesHttp() {
  const { http } = useHttp()

  async function getEmpModeratorSlices() {
    return http.get<SuppSlice[]>(`${emp_moderator_url}/CheckPointReport`)
  }

  async function deleteEmpModeratorSlice(id: number) {
    return http.delete(`${emp_moderator_url}/CheckPointReport/${id}`)
  }

  async function uploadEmpModeratorSlice(formData: FormData) {
    return http.post(`${emp_moderator_url}/FileReport`, formData)
  }

  return { getEmpModeratorSlices, deleteEmpModeratorSlice, uploadEmpModeratorSlice }
}
