import useContractsStagesHttp from '@/composables/http/use-contracts-stages-http.composable'
import type { TprConnection } from '@/interfaces/contracts-entities/tpr-connection.interface'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { computed, ref, type Ref } from 'vue'

export default function useTprConnections(rows?: Ref<TprStandart[]>) {
  const { getAllTprToContractConnections, getOneTprToContractConnection: getOneConnection } =
    useContractsStagesHttp()
  const connections = ref<TprConnection[]>([])

  async function getConnections(year: number) {
    return getAllTprToContractConnections(year).then(({ data }) => {
      connections.value = data
    })
  }

  const connectionMappedRows = computed(() => {
    if (!rows) return []
    return rows.value.map((row) => {
      row.connection = connections.value.find((connection) => connection.projectId === row.ID)
      return row
    })
  })

  return { connections, getConnections, connectionMappedRows, getOneConnection }
}
