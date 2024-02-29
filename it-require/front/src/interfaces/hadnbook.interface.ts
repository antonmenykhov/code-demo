export interface HandbookItem {
  id: number
  name: string
  handbookId: number
}

export type CreateHandbookItemDto = Omit<HandbookItem, 'id'>

export interface Handbook {
  id: number
  name: string
  description: string
  items?: HandbookItem[]
}

export type CreateHandbookDto = Omit<Handbook, 'id' | 'items'>
