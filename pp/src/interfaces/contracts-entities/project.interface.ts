import type { Stage } from './stage.interface'

export interface Project {
  id: number
  contractId: string
  projectId: number
  genwork: boolean
  genId: number
  year: number
  stages: Stage[]
}
