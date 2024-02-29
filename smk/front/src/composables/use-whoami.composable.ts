import baseUrl from '@/config/baseUrl'
import type { AxiosInstance } from 'axios'
import { inject } from 'vue'

export default function useWhoami(initHttp?: AxiosInstance) {
  const http = initHttp || (inject('http') as AxiosInstance)
  async function whoami() {
    const { data } = await http.get(`${baseUrl.baseUrl}/service-staff/whoami`)
    return data
  }

  return { whoami }
}
