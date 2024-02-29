import { baseUrl } from '@/config/baseUrl'
import type { BuisnessTrip } from '@/interfaces/buisness-trip.interface'
import type { AxiosInstance } from 'axios'
import { inject } from 'vue'

export default function useBusinessTrip() {
  const http = inject('http') as AxiosInstance
  async function getAll() {
    const { data } = await http.get(`${baseUrl}/list_all/business_trip`)
    return (data as BuisnessTrip[]).filter((it) => it.id !== null)
  }

  async function getOne(id: number) {
    const { data } = await http.get(`${baseUrl}/get/business_trip/${id}`)
    return data as BuisnessTrip
  }

  async function create(bt: BuisnessTrip) {
    const { data } = await http.post(`${baseUrl}/add/business_trip`, { ...bt, id: undefined })
    return data
  }

  async function update(bt: BuisnessTrip) {
    const { data } = await http.put(`${baseUrl}/update/business_trip`, { ...bt })
    return data
  }

  async function remove(bt: BuisnessTrip) {
    const { data } = await http.delete(`${baseUrl}/delete/business_trip`, { data: { id: bt.id } })
    return data
  }

  return { getAll, getOne, create, update, remove }
}
