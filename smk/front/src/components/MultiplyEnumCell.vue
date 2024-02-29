<template>
  <div class="multiply-enum-cell">
    <div
      class="editor"
      v-if="
        isEditing &&
        column.lookup &&
        column.lookup.handbook &&
        column.lookup.displayExpr &&
        column.lookup.valueExpr
      "
    >
      <div class="new-multiply-item" v-if="editable">
        <SelectBox
          :options="column.lookup.handbook"
          v-model:value="newItem"
          :display-expr="column.lookup.displayExpr"
          :value-expr="column.lookup.valueExpr"
          allow-search
          show-clear-button
          :invalid="invalid"
          :invalid-text="invalidText"
        />
        <ButtonComponent
          :disabled="newItem === '' || newItem === null"
          css-class="small-button"
          icon-class="fa-solid fa-add"
          @click="addItem"
        />
      </div>
      <div class="exist-item" v-for="(item, index) in displayList" :key="item">
        <div class="name">{{ item }}</div>
        <ButtonComponent
          v-if="editable"
          css-class="small-button"
          icon-class="fa-solid fa-close"
          @click="deleteItem(index)"
        />
      </div>
    </div>
    <div class="value" v-else>{{ row[column.name] }}</div>
  </div>
</template>
<script lang="ts" setup>
import { SelectBox, type TableColumn, type TableRow, ButtonComponent } from 'tnnc-ui-kit'
import { computed, inject, ref } from 'vue'

const props = defineProps<{
  isEditing?: boolean
  column: TableColumn
  row: TableRow
  invalid?: boolean
  invalidText?: string
  editable?: boolean
}>()
const setRow = inject('setRow') as (newRow: TableRow) => void
const newItem = ref('')
const valueList = computed(() =>
  `${props.row[props.column.name]}`.length > 1 && props.row[props.column.name] !== null
    ? `${props.row[props.column.name]}`.split(';')
    : []
)
const displayList = computed(() => {
  const { column } = props
  return valueList.value.map((item) => {
    if (
      column.lookup &&
      column.lookup.displayExpr &&
      column.lookup.handbook &&
      column.lookup.valueExpr
    ) {
      const handbookItem = column.lookup.handbook.find(
        (it) => it[column.lookup?.valueExpr] === item
      )
      if (handbookItem) return handbookItem[column.lookup.displayExpr]
    }
    return item
  })
})
function deleteItem(index: number) {
  const newValueList = [...valueList.value]
  newValueList.splice(index, 1)
  setRow({ ...props.row, [props.column.name]: newValueList.join(';') })
}

function addItem() {
  const newValueList = [...valueList.value]
  newValueList.push(newItem.value)
  setRow({ ...props.row, [props.column.name]: newValueList.join(';') })
  newItem.value = ''
}
</script>
<style lang="scss" scoped>
.small-button {
  height: 20px;
  font-size: 12px;
}
.new-multiply-item,
.exist-item {
  display: flex;
  gap: 5px;
  width: 100%;
  align-items: center;
  overflow: hidden;
  .tnnc-select-box {
    flex: 1;
    overflow: hidden;
  }
}
</style>
