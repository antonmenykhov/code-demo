import baseUrl from '@/config/baseUrl'
import type { Department } from '@/interfaces/department.interface'
import type { AxiosInstance } from 'axios'
import { inject, ref, type Ref } from 'vue'

export default function useDepartments() {
  const departments: Ref<Department[]> = ref([])
  const http = inject('http') as AxiosInstance
  http.get(`${baseUrl.baseUrl}/service-staff/departments`).then(({ data }) => {
    departments.value = data
  })
  return { departments }
}
