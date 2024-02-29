import type { TprConnection } from '@/interfaces/contracts-entities/tpr-connection.interface'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { useLoadingState } from '@/store/loading.state'
import type { EditingStartEvent } from 'tnnc-ui-kit'
import type { ComputedRef, Ref } from 'vue'

export default function useTprEditing(
  getItemsByIds: (ids: number[]) => Promise<TprStandart[]>,
  isFullTprShowed: Ref<boolean>,
  rows: Ref<TprStandart[]> | ComputedRef<TprStandart[]>,
  connections: Ref<TprConnection[]>,
  emit: (
    e: 'editingStart',
    data: {
      currentRow: TprStandart
      rowsWithSameMainNumber: TprStandart[]
      rowsWithSameContractId: TprStandart[]
    }
  ) => void,
  addChangeRow: (
    diff: Partial<TprStandart>,
    isNew?: boolean | undefined,
    row?: TprStandart | undefined
  ) => Promise<number | null>,
  getConnections: (year: number) => Promise<void>,
  year: ComputedRef<number>
) {
  const { setManualLoading } = useLoadingState()
  function startEditing(e: EditingStartEvent<TprStandart>) {
    e.stop()
    emitEditingStart(e.row.ID)
  }

  async function emitEditingStart(rowId: number) {
    const currentRow = isFullTprShowed.value
      ? (rows.value.find((row) => row.ID === rowId) as TprStandart)
      : (await getItemsByIds([rowId]))[0]
    currentRow.subs = rows.value.filter((row) =>
      currentRow.genwork_CalendarPlan
        ? row.parentId_CalendarPlan === currentRow.ID
        : row.ID === currentRow.parentId_CalendarPlan
    )
    currentRow.connection = connections.value.find(
      (connection) => connection.projectId === currentRow.ID
    )
    const rowsWithSameMainNumber =
      currentRow.connection?.mainNumber && currentRow.connection.mainNumber.length
        ? (connections.value
            .filter((connection) => connection.mainNumber === currentRow.connection?.mainNumber)
            .map((connection) => rows.value.find((row) => row.ID === connection.projectId))
            .filter((row) => row !== undefined) as TprStandart[])
        : [currentRow]
    rowsWithSameMainNumber.forEach((currentRow) => {
      currentRow.subs = rows.value.filter((row) =>
        currentRow.genwork_CalendarPlan
          ? row.parentId_CalendarPlan === currentRow.ID
          : row.ID === currentRow.parentId_CalendarPlan
      )
    })
    const rowsWithSameContractId = connections.value
      .filter((connection) => connection.contractId === currentRow.connection?.contractId)
      .map((connection) => rows.value.find((row) => row.ID === connection.projectId))
      .filter((row) => row != undefined) as TprStandart[]

    emit('editingStart', { currentRow, rowsWithSameMainNumber, rowsWithSameContractId })
  }

  async function addChangeRowHandler(
    diff: Partial<TprStandart>,
    isNew?: boolean,
    row?: TprStandart,
    needUpdateConnections = false
  ) {
    setManualLoading(true)
    setTimeout(async () => {
      const rowID = await addChangeRow(diff, isNew, row)
      if (needUpdateConnections) getConnections(year.value)
      if (rowID) emitEditingStart(rowID)
    }, 1)
  }

  return { startEditing, emitEditingStart, addChangeRowHandler }
}
