import type { Department } from '@/interfaces/department.interface'
import type { DirectorOfDeparment } from '@/interfaces/director-of-department.interface'
import type { Employee } from '@/interfaces/employee.interface'
import type { Mvz } from '@/interfaces/mvz.interface'
import type { HandbookList } from '@/views/handbooks/useHandbooks.composable'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const handbooksStore = defineStore('handbooks', () => {
  const handbooks: Ref<HandbookList> = ref({
    cities: [],
    daily_payment: [],
    grades: [],
    hotels: [],
    planning_periods: [],
    states: [],
    plane_tickets: [],
    train_tickets: [],
    trip_purposes: [],
    budget_codes: [],
    trip_types: [],
    trip_goals: [],
    fin_structures: [],
    accounts: [],
    user_access: [],
    user_roles: [],
    users: [],
    limits: [],
    limit_divisions: [],
    versions: [],
    version_statuss: [],
    expense_types: []
  })
  const departments: Ref<Department[]> = ref([])
  const mvz: Ref<Mvz[]> = ref([])
  const employees: Ref<Employee[]> = ref([])
  const departmnetsTree = ref<Department[]>([])
  const directorsOfDepartment = ref<DirectorOfDeparment[]>([])

  function setMvz(data: Mvz[]) {
    mvz.value = data
  }
  function setDepartments(data: Department[]) {
    departments.value = data
  }
  function setHandbooks(data: HandbookList) {
    handbooks.value = data
  }
  function setEmployees(data: Employee[]) {
    employees.value = data
  }
  function setDepartmentsTree(data: Department[]) {
    departmnetsTree.value = data
  }
  function setDirectorOfDepartments(data: DirectorOfDeparment[]) {
    directorsOfDepartment.value = data
  }

  return {
    handbooks,
    departments,
    mvz,
    setMvz,
    setHandbooks,
    setDepartments,
    employees,
    setEmployees,
    setDepartmentsTree,
    departmnetsTree,
    directorsOfDepartment,
    setDirectorOfDepartments
  }
})
