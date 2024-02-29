import { serviceStaffUrl } from '@/config/baseUrl'
import type { Employee } from '@/interfaces/employee.interface'
import type { PhonebookRecord } from '@/interfaces/phonebook-record.interface'
import { handbooksStore } from '@/store/hanbooks.store'
import type { AxiosInstance } from 'axios'
import { inject } from 'vue'

export default function useServiceStaff(initHttp?: AxiosInstance) {
  const http = initHttp || (inject('silentHttp') as AxiosInstance)
  const { setMvz, setDepartments, setEmployees, setDepartmentsTree, setDirectorOfDepartments } =
    handbooksStore()

  async function getEmployees() {
    const { data } = await http.post(`${serviceStaffUrl}/api/Employee/GetEmployees`)
    setEmployees(data.message)
    return data.message as Employee[]
  }

  async function getMyPhoneBookRecord() {
    const { data } = await http.post(`${serviceStaffUrl}/api/Employee/GetAuthEmployeeId`)
    const empId = data.message
    const { data: record } = await http.post(
      `${serviceStaffUrl}/api/Phonebook/GetPhonebookRecord`,
      JSON.stringify(`${empId}`),
      { headers: { 'Content-Type': 'application/json-patch+json' } }
    )
    return record.message as PhonebookRecord
  }

  async function getMvz() {
    const { data } = await http.post(`${serviceStaffUrl}/api/Mvz/GetAllMvz`)
    setMvz(data.message)
  }

  async function getDepartments() {
    return http.post(`${serviceStaffUrl}/api/Department/GetAllDepartments`).then(({ data }) => {
      setDepartments(data.message)
    })
  }

  async function getDepartmentsTree() {
    return http.post(`${serviceStaffUrl}/api/department/getTree`).then(({ data }) => {
      setDepartmentsTree([data.message])
    })
  }

  async function getDirectorsOfDepartment() {
    return http
      .post(`${serviceStaffUrl}/api/DirectorOfDepartment/GetDirectorsOfDepartment`)
      .then(({ data }) => {
        setDirectorOfDepartments(data.message)
      })
  }

  return {
    getEmployees,
    getMyPhoneBookRecord,
    getMvz,
    getDepartments,
    getDepartmentsTree,
    getDirectorsOfDepartment
  }
}
