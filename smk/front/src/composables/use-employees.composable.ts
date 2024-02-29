import baseUrl from '@/config/baseUrl'
import type { Employee } from '@/interfaces/employee.interface'
import type { AxiosInstance } from 'axios'
import { inject, type Ref, ref } from 'vue'

export default function useEmployees() {
  const http = inject('http') as AxiosInstance
  const employees: Ref<Employee[]> = ref([])
  // const employyedEmployees: Ref<Employee[]> = ref([])
  http
    .get(`${baseUrl.baseUrl}/service-staff/employees`)
    .then(({ data }) => {
      employees.value = data
    })
    .catch(() => {
      employees.value = []
    })

  //  http.get(`${baseUrl.baseUrl}/service-staff/employed-employees`).then(({ data }) => {
  //    employyedEmployees.value = data
  //  })

  return {
    employees
    //employyedEmployees
  }
}
