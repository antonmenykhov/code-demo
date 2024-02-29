import { contracts_url } from '@/config/urls'
import useHttp from './use-http.composable'
import type { TprConnection } from '@/interfaces/contracts-entities/tpr-connection.interface'
import type { Stage } from '@/interfaces/contracts-entities/stage.interface'
import type { Contract } from '@/interfaces/contracts-entities/contract.interface'

export default function useContractsStagesHttp() {
  const { http } = useHttp()
  const { http: silentHttp } = useHttp(true)

  // connections
  async function getAllTprToContractConnections(year: number) {
    return silentHttp.get(`${contracts_url}/connect-with-supp/tiny/${year}`)
  }

  async function getOneTprToContractConnection(id: number) {
    return silentHttp.get<TprConnection>(`${contracts_url}/connect-with-supp/single/${id}`)
  }

  async function createTprToContractStageConnection(
    projectId: number,
    stageId: string,
    year: number
  ) {
    return http.post<TprConnection>(`${contracts_url}/connect-with-supp/stage-connect`, {
      projectId,
      stageId,
      year
    })
  }

  async function upsertTprToContractConnection(
    year: number,
    contractID: string | null,
    projectID: number,
    genwork: boolean,
    genId: number
  ) {
    return http.post<TprConnection>(`${contracts_url}/connect-with-supp/`, {
      year,
      contractID,
      projectID,
      genwork,
      genId
    })
  }

  // contracts
  async function getContractWithIndexes(contractId: string) {
    return http.get<Contract>(`${contracts_url}/contracts-stages/contract-card/${contractId}`)
  }

  async function getContractByContractNumber(contractNumber: string) {
    return http.post<Contract[]>(`${contracts_url}/contracts/contract-number`, {
      contractNumber
    })
  }

  async function getSimilarContracts(contractPart: string) {
    return silentHttp.post(`${contracts_url}/contracts/similar`, { contractNumber: contractPart })
  }

  // stages
  async function getStagesByContractId(contractId: string) {
    return http.get<Stage[]>(`${contracts_url}/contracts-stages/stages/${contractId}`)
  }

  return {
    createTprToContractStageConnection,
    getStagesByContractId,
    getContractByContractNumber,
    getContractWithIndexes,
    upsertTprToContractConnection,
    getAllTprToContractConnections,
    getOneTprToContractConnection,
    getSimilarContracts
  }
}
