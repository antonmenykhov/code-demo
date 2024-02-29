import type { TypicalItem } from '../typical-item.interface'

export interface IndustrialBlock extends TypicalItem {
  parentId: null | number
  isOther: boolean
}
