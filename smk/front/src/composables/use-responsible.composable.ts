import baseUrl from '@/config/baseUrl'
import type { AxiosInstance } from 'axios'
import { inject } from 'vue'

export default function useResponsible(questionGroupId: number) {
  const http = inject('http') as AxiosInstance
  const url = `${baseUrl.baseUrl}/responsible`
  async function addResponsible(userId: string) {
    return http.post(url, { questionGroupId, userId })
  }

  async function removeResponible(responsibleId: number) {
    return http.delete(`${url}/${responsibleId}`)
  }

  return { addResponsible, removeResponible }
}
