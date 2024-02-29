<template>
  <div class="table-component">
    <Row class="table-component-toolbar" :justify="'space-between'" :gutter="[5, 5]">
      <Col span="17" class="flex">
        <InputSearch
          placeholder="Поиск..."
          class="small-input"
          v-model:value="filterPhrase"
          autoComplete="off"
        ></InputSearch>

        <slot name="toolbar-left"></slot>
      </Col>
      <Col span="6">
        <Row :justify="'end'">
          <slot name="toolbar-right-before"></slot>
          <Button v-if="!hideAddButton" :type="'primary'" @click="createHandler">Создать</Button>
          <slot name="toolbar-right-after"></slot>
        </Row>
      </Col>
    </Row>
    <Table
      bordered
      :columns="tableColumns"
      :data-source="filteredRows"
      class="table-component-table"
      @resize-column="handleResizeColumn"
      size="middle"
      :custom-row="
        (record) => {
          return { onDblclick: (e) => emitClick(record, e) }
        }
      "
    >
      <template #bodyCell="{ column, value, record }">
        <slot name="bodyCell" :column="column" :value="value" :record="record"></slot>
        <template v-if="column.key === 'id'">
          <slot name="button-cell" :value="value"></slot>
          <Button size="small" type="text" @click="updateHandler(value)">Редактировать</Button>
          <a-popconfirm title="Удалить запись?" @confirm="deleteHandler(value)">
            <Button size="small" type="text" danger>Удалить</Button>
          </a-popconfirm>
        </template>
        <template v-if="!customCellName?.includes(`${column.key}`) && column.key !== 'id'"
          >{{ value }}
        </template>
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
export type TableColumn = {
  name: string
  caption: string
  disableSort?: boolean
  customSorter?: CompareFn<any>
}

import { useDebounce } from '@vueuse/core'
import { Col, InputSearch, Row, Table, type TableColumnsType, Button } from 'ant-design-vue'
import type { ColumnType, CompareFn } from 'ant-design-vue/es/table/interface'
import { computed, ref } from 'vue'

const props = defineProps<{
  rows: any[]
  columns: TableColumn[]
  hideAddButton?: boolean
  hideActionButtons?: boolean
  customCellName?: string[]
  tableName?: string
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'update', contractor: any): void
  (e: 'delete', id: number): void
  (e: 'click', item: any): void
}>()

function generateColumns() {
  const savedWidths = getSavedColumnsWidths()
  tableColumns.value = props.columns.map((column) => ({
    key: column.name,
    dataIndex: column.name,
    title: column.caption,
    resizable: true,
    width: savedWidths.find((col) => col.key === column.name)?.width || 200,
    sorter:
      column.customSorter ||
      (!column.disableSort
        ? (a: any, b: any) => {
            if (a[column.name] > b[column.name]) return 1
            if (b[column.name] > a[column.name]) return -1
            return 0
          }
        : undefined)
  }))
  if (!props.hideActionButtons) tableColumns.value.push({ key: 'id', width: 100 })
}

const tableColumns = ref<TableColumnsType>()
function handleResizeColumn(w: number, col: ColumnType<any>) {
  col.width = w
  saveColumnsWidths()
}

function getSavedColumnsWidths(): { key: string; width: number }[] {
  if (props.tableName) {
    return JSON.parse(localStorage.getItem(`${props.tableName}-columns`) || '""') || []
  }
  return []
}

function saveColumnsWidths() {
  if (props.tableName) {
    localStorage.setItem(
      `${props.tableName}-columns`,
      JSON.stringify(
        tableColumns.value?.map((column) => ({ key: column.key, width: column.width }))
      )
    )
  }
}

const filterPhrase = ref('')
const debouncedFilterPhrase = useDebounce(filterPhrase, 100)
const filteredRows = computed(() =>
  debouncedFilterPhrase.value.length > 0
    ? props.rows.filter((row) => {
        return props.columns.some((column) =>
          `${row[column.name]}`.toLowerCase().includes(debouncedFilterPhrase.value.toLowerCase())
        )
      })
    : props.rows
)

function createHandler() {
  emit('create')
}
function deleteHandler(data: any) {
  emit('delete', data.id)
}
function updateHandler(data: any) {
  emit('update', data)
}
function emitClick(data: any, e: MouseEvent) {
  e.preventDefault()
  emit('click', data)
}

generateColumns()
</script>
<style lang="scss">
.table-component {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  .table-component-table {
    flex: 1;
  }
  .small-input {
    width: 400px;
  }
  .table-component-toolbar {
    margin-bottom: 10px;
  }
  .ant-table-row {
    cursor: pointer;
  }
}
.flex {
  display: flex;
  gap: 5px;
}
</style>
