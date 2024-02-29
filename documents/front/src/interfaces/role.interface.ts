export interface Role {
  id: string
  name: string
  description: string
  scopeParamRequired: boolean
  composite: boolean
  composites?: Composites
  clientRole: boolean
  containerId: string
  attributes?: {
    [index: string]: string[]
  }
}
export interface Composites {
  realm?: string[]
  client?: {
    [index: string]: string[]
  }
  application?: {
    [index: string]: string[]
  }
}
