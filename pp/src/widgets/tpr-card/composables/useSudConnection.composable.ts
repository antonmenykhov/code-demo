import useContractsStagesHttp from '@/composables/http/use-contracts-stages-http.composable'
import type { Contract } from '@/interfaces/contracts-entities/contract.interface'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { inject, type ComputedRef } from 'vue'

export default function useSudConnection(
  choosedRow: ComputedRef<TprStandart>,
  year: ComputedRef<number>
) {
  const { upsertTprToContractConnection, getContractByContractNumber, getContractWithIndexes } =
    useContractsStagesHttp()
  const setChange = inject('setChange') as <
    K extends keyof TprStandart,
    T extends TprStandart[K]
  >(change: {
    field: K
    value: T
  }) => void
  async function toggleConnection(contract?: Contract | undefined) {
    return upsertTprToContractConnection(
      year.value,
      contract?.id || null,
      choosedRow.value.ID,
      choosedRow.value.genwork_CalendarPlan,
      choosedRow.value.parentId_CalendarPlan
    )
  }

  function setContractInfo(contract: Contract | undefined) {
    if (contract) {
      setChange({ field: 'start_CalendarPlan', value: contract.start })
      setChange({ field: 'finish_CalendarPlan', value: contract.finish })
      setChange({ field: 'dateConclusionContractFact_CalendarPlan', value: contract.realSignDate })
      setChange({
        field: 'totalContract_CalendarPlan',
        value: contract.projects
          .filter((project) => project.projectId === choosedRow.value.ID)
          .reduce((acc, project) => {
            project.stages.forEach((stage) => (acc += +stage.price || 0))
            return acc
          }, 0)
      })
    }
    copyPlanCp(contract)
  }

  function copyPlanCp(contract?: Contract | undefined) {
    const indexes = contract?.indexes.find((index) => index.year === year.value)
    for (let i = 1; i < 13; i++) {
      setChange({
        field: `${
          choosedRow.value.genwork_CalendarPlan ? 'general' : 'sub'
        }_mounth${i}_planCp_None` as keyof TprStandart,
        value: indexes ? indexes[`contractIndex${i}` as keyof typeof indexes] : 0
      })
    }
  }
  function copyName(contract: Contract) {
    setChange({ field: 'name_CalendarPlan', value: contract.name })
  }

  return {
    toggleConnection,
    copyName,
    copyPlanCp,
    setContractInfo,
    getContractWithIndexes,
    getContractByContractNumber
  }
}
