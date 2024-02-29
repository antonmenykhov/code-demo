import { helpservice_url } from '@/config/urls'
import useHttp from './use-http.composable'
import type { ClosedPeriod } from '@/interfaces/help-entities/close-period.interface'

export default function useLocksHttp() {
  const { http } = useHttp()
  const { http: silentHttp } = useHttp(true)

  async function getSuppLocks() {
    return http.get(`${helpservice_url}/report-lock`)
  }

  async function getTprClosePeriod(year: number) {
    return silentHttp.get<ClosedPeriod>(`${helpservice_url}/close-period/${year}`)
  }

  async function updateTprClosedPeriod(year: number, closeMonth: number) {
    return http.put(`${helpservice_url}/close-period/${year}`, {
      closeMonth
    })
  }

  return { getSuppLocks, getTprClosePeriod, updateTprClosedPeriod }
}
