import type { TypicalItem } from '../typical-item.interface'

export interface Department extends TypicalItem {
  shortName: string | null
  curatorDepartmentId: null | number
  curatorDepartment: null | string
  blockDepartmentId: number | null
  groupDepartmentId: number | null
}
