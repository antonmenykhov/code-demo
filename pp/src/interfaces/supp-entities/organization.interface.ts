import type { TypicalItem } from '../typical-item.interface'

export interface Organization extends TypicalItem {
  industrialBlockId: number
  perimetr: boolean
  perimetrPlan: boolean | null
  ksk: null | string
}
