import type { Employee } from './employee.interface'

export interface PhonebookRecord extends Employee {
  id: string
  employeeId: string
  employeeFullName: string
  departmentId: string
  departmentName: string
  staffPosName: string
  phoneInternal: string
  phone: string
  phoneMobile: string
  numberCabinet: string
  house: string
  email: string
  familyOfDeputy: string
  shortBirthday: string
  tabnum: string
  isManager: boolean
  managerLogin: string
  dms: string
  username: string
  year: string
  gender: string
  functionalCommunityId: string
  functionalCommunity: string
  mvz: string
  mvzSapCode: string
  depLevel3Id: string
  level3: string
}
