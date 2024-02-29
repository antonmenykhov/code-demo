import useTprHttp from '@/composables/http/use-tpr-http.composable'
import useArrayUtils from '@/composables/useArrayUtils.composable'
import type { Department } from '@/interfaces/supp-entities/department.interface'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { useLoadingState } from '@/store/loading.state'
import type { Column } from 'tnnc-ui-kit'
import { notify } from 'tnnc-ui-kit'
import { computed, ref, type Ref } from 'vue'

export default function useTprCrud(columnsConfig: Column[], year: Ref<number>) {
  const { getAllTprs, getTprsByIds, upsertTpr, deleteTpr } = useTprHttp()
  const { setManualLoading } = useLoadingState()
  const { deleteElement, replaceElement } = useArrayUtils()
  const cols = computed(() => {
    const plainColumns: Column[] = []
    const getCols = (columns: Column[]) => {
      columns.forEach((column) => {
        if (column.child && column.child.length !== 0) {
          getCols(column.child)
        } else {
          plainColumns.push(column)
        }
      })
    }
    getCols(columnsConfig)
    return plainColumns
  })
  function hydrateRows(tinyRows: string[][]) {
    const headers = tinyRows.splice(0, 1)[0] as (keyof TprStandart)[]
    return tinyRows.map((rowArr) => {
      const row = {} as any
      headers.forEach((header, index) => {
        row[header] = rowArr[index]
      })
      return row
    }) as TprStandart[]
  }
  async function getRows(
    year: number,
    departmentList: Department[],
    growingRange: number[],
    fast = false
  ) {
    return getAllTprs(year, departmentList, growingRange, fast).then(({ data }) => {
      rows.value = hydrateRows(data).sort((a, b) => a.ID - b.ID)
    })
  }

  function mapGenSub(rows: TprStandart[]) {
    return rows.map((currentRow) => {
      currentRow.subs = (
        currentRow.genwork_CalendarPlan
          ? rows.filter((row) => row.parentId_CalendarPlan === currentRow.ID)
          : rows.filter((row) => row.ID === currentRow.parentId_CalendarPlan)
      ).map((row) => {
        row.subs = []
        return row
      })

      return currentRow
    })
  }

  async function deleteRow(e: TprStandart) {
    deleteTpr(e.ID)
      .then(() => {
        notify('Строка удалена')
        deleteElement(rows, e, 'ID')
      })
      .catch((error) => {
        notify(error, 'danger')
      })
  }

  async function addChangeRow(
    diff: Partial<TprStandart>,
    isNew?: boolean,
    row?: TprStandart
  ): Promise<null | number> {
    const payload = isNew ? diff : row ? generatePayloadEapi(diff, row) : null
    if (!payload) return null
    return upsertTpr(payload)
      .then(async ({ data }) => {
        notify('ТПР сохранен')
        if (!isNew && row) {
          ;(await getItemsByIds([row.ID, ...(row.subs?.map((sub) => sub.ID) || [])])).forEach(
            (changedRow) => {
              replaceElement(rows, changedRow, 'ID')
            }
          )
          return row.ID
        } else {
          const newElements = await getItemsByIds(hydrateRows(data).map((item) => item.ID))
          rows.value.push(...newElements)
          if (newElements.length === 0) setManualLoading(false)
          return newElements[0]?.ID || null
        }
      })
      .catch((error) => {
        setManualLoading(false)
        notify(error, 'danger', 3000)
        return null
      })
  }

  async function getItemsByIds(ids: number[]) {
    const rawRows = (await getTprsByIds(year.value, ids)).data
    return rawRows.length > 1 ? hydrateRows(rawRows) : []
  }

  // Методы генерации посылки для единого АПИ
  function generatePayloadEapi(diff: Partial<TprStandart>, rowData: TprStandart) {
    let payload = {
      years: year.value,
      id: rowData.id_CalendarPlan || -1
    } as any
    ;(Object.keys(diff) as Array<keyof TprStandart>).forEach((key) => {
      const column = cols.value.find((column) => column.name === key)
      if (column && column.meta?.crud_group) {
        if (column.meta.crud_group === 'Stage') {
          payload = {
            ...payload,
            ...generateStageObj(key, diff[key] as number, rowData, diff)
          }
        } else if (column.meta.crud_group === 'ContractPlan') {
          payload = {
            ...payload,
            ...generateContractPlanObj(key, diff[key] as number, rowData)
          }
        } else {
          payload[key] = diff[key]
          //    payload[`id_${column.meta.crud_group}`] =
          //      rowData[`id_${column.meta.crud_group}` as keyof TprStandart]
          //    if (column.meta.crud_group !== 'CalendarPlan')
          //      payload[`calendarPlanId_${column.meta.crud_group}`] = rowData.id_CalendarPlan
          if (
            column.columnType === 'enum' &&
            column.name !== 'monitoringUnplannedWork_GhostCalendarPlan'
          ) {
            payload[`${key.split('_')[0]}Id_${column.meta.crud_group}`] =
              diff[`${key}Id` as keyof TprStandart]
            delete payload[key]
          }
          if (column.name === 'numberContract_None') {
            payload.calendarPlanId_NumberContract = rowData.id_CalendarPlan
            payload.numberContractId_CalendarPlan = null
          }
        }
      }
    })
    if (Object.keys(payload).includes('id_CalendarPlan')) {
      Object.keys(payload).forEach((key) => {
        if (key.split('_')[0] === 'calendarPlanId') {
          delete payload[key]
        }
      })
    }
    return payload
  }

  function generateContractPlanObj(key: keyof TprStandart, value: number, rowData: TprStandart) {
    const newObj = {} as any
    const month = +key.split('_')[1].split('h')[1]
    // newObj[`calendarPlanId_ContractPlan&${month}`] = rowData.id_CalendarPlan
    //  newObj[`id_ContractPlan&${month}`] =
    //    rowData[('plancp_' + key.split('_')[1] + '_id') as keyof TprStandart]
    newObj[`price_ContractPlan&${month}`] = value
    newObj[`finish_ContractPlan&${month}`] = `${year.value}-${
      month < 10 ? '0' + month : month
    }-01T00:00:00`
    return newObj
  }

  function generateStageObj(
    key: keyof TprStandart,
    value: number,
    rowData: TprStandart,
    diff: Partial<TprStandart>
  ) {
    const newObj = {} as any
    const month = +key.split('_')[1].split('h')[1]
    // newObj[`calendarPlanId_Stage&${month}`] = rowData.id_CalendarPlan
    //  newObj[`id_Stage&${month}`] = rowData[(key.split('_')[1] + '_id') as keyof TprStandart]
    newObj[`${key.split('_')[2]}_Stage&${month}`] = value
    newObj[`finish_Stage&${month}`] = `${year.value}-${
      month < 10 ? '0' + month : month
    }-01T00:00:00`
    if (!diff[`${key.split('_')[0]}_mounth${month}_price_Stage` as keyof TprStandart]) {
      newObj[`price_Stage&${month}`] = 0
    }
    return newObj
  }

  const rows: Ref<TprStandart[]> = ref([])
  const mappedGenSubRows = computed(() => mapGenSub(rows.value))
  return { rows, getRows, deleteRow, addChangeRow, mappedGenSubRows, getItemsByIds }
}
