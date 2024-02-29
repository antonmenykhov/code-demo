import { supp_url } from '@/config/urls'
import useHttp from './use-http.composable'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import type { Department } from '@/interfaces/supp-entities/department.interface'
import type { TprError } from '@/interfaces/supp-entities/tpr-error.interface'

export default function useTprHttp() {
  const { http } = useHttp()

  async function getTprLight(year: number) {
    return http.get(`${supp_url}/report/themplan/year=${year}`)
  }

  async function getTprChecks() {
    return http.get<Partial<TprStandart>[]>(
      `${supp_url}/report/check/1
  `
    )
  }

  async function getTprErrors(year: number, ids?: number[]) {
    let url = `${supp_url}/report/errors/year=${year}`
    if (ids) url += `&ids={${ids.join(',')}}`
    return http.get<TprError[]>(url)
  }

  async function getAllTprs(
    year: number,
    departmentList: Department[],
    growingRange: number[],
    fast = false
  ) {
    return http.get<string[][]>(
      `${supp_url}/report2/ProductProduction/year=${year}&departments=%7B${departmentList
        .map((dep) => dep.id)
        .join(',')}%7D&mounth=${growingRange[0]}_${growingRange[1]}${fast ? '&options=fast' : ''}`
    )
  }

  async function deleteTpr(id: number) {
    return http.delete(`${supp_url}/CalendarPlan`, { data: { id } })
  }

  async function upsertTpr(payload: any) {
    return http.put<string[][]>(`${supp_url}/eapi`, payload)
  }

  async function getTprsByIds(year: number, ids: number[]) {
    return http.get<string[][]>(
      `${supp_url}/report/ProductProduction/year=${year}&ids={${ids.join(',')}}`
    )
  }

  return { getTprLight, getTprChecks, getAllTprs, deleteTpr, upsertTpr, getTprsByIds, getTprErrors }
}
