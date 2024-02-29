import type { TypicalItem } from '../typical-item.interface'

export interface DepartmentOrganization extends TypicalItem {
  fullName: string
  organizationId: null | number
}
