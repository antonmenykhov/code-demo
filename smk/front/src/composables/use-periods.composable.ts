import baseUrl from '@/config/baseUrl'
import type { SurveyPeriod } from '@/interfaces/survey-period.interface'
import type { AxiosInstance } from 'axios'
import { inject, ref, type Ref } from 'vue'

export default function usePeriods() {
  const http = inject('http') as AxiosInstance
  const periods: Ref<SurveyPeriod[]> = ref([])
  const url = `${baseUrl.baseUrl}/survey-period`

  async function getPeriods() {
    return http.get(url).then(({ data }) => {
      periods.value = data
    })
  }

  async function create(periodName: string, start: Date, finish: Date) {
    return http.post(url, { periodName, start, finish }).then(({ data }) => {
      periods.value.push(data)
    })
  }

  async function change(periodName: string, start: Date, finish: Date, id: number) {
    return http.patch(`${url}/${id}`, { periodName, start, finish }).then(() => {
      const index = periods.value.findIndex((period) => period.id === id)
      if (index !== -1)
        periods.value.splice(index, 1, {
          id,
          periodName,
          start,
          finish,
          resultsSended: periods.value[index].resultsSended
        })
    })
  }

  async function remove(id: number) {
    return http.delete(`${url}/${id}`).then(() => {
      const index = periods.value.findIndex((period) => period.id === id)
      if (index !== -1) periods.value.splice(index, 1)
    })
  }

  getPeriods()

  return { periods, remove, create, change }
}
