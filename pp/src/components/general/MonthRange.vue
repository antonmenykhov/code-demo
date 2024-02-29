<template>
  <div class="month-range">
    <SelectBox
      v-if="!hideFrom"
      label="Нар.итог начало"
      :options="startMonthList"
      :value="range[0]"
      display-expr="name"
      value-expr="id"
      @update:value="updateStartDate"
    />
    <SelectBox
      label="Нар.итог конец"
      :options="finishMonthList"
      :value="range[1]"
      display-expr="name"
      value-expr="id"
      @update:value="updateFinishDate"
    />
  </div>
</template>
<script lang="ts" setup>
import { SelectBox } from 'tnnc-ui-kit'
import { monthHandbook } from '@/hooks/months'
import { computed } from 'vue'
import { useLoadingState } from '@/store/loading.state'

const { setManualLoading } = useLoadingState()
const props = defineProps<{
  text: string
  range: number[]
  withoutLoader?: boolean
  hideFrom?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:range', data: number[]): void
}>()
function updateStartDate(month: number) {
  if (props.withoutLoader) return emit('update:range', [month, props.range[1]])
  setManualLoading(true)
  setTimeout(() => {
    emit('update:range', [month, props.range[1]])
  }, 50)
}
function updateFinishDate(month: number) {
  if (props.withoutLoader) return emit('update:range', [props.range[0], month])
  setManualLoading(true)
  setTimeout(() => {
    emit('update:range', [props.range[0], month])
  }, 50)
}
const startMonthList = computed(() => monthHandbook.filter((item) => item.id <= props.range[1]))
const finishMonthList = computed(() => monthHandbook.filter((item) => item.id >= props.range[0]))
</script>
<style lang="scss">
.month-range-list {
  width: 300px !important;
  border-top-right-radius: 10px !important;
}
.month-range {
  display: flex;
  gap: 5px;
}
</style>
