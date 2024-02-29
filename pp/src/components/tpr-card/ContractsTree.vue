<template>
  <div class="tpr-card-contracts-tree tpr-card-collapsable-block">
    <div class="tpr-tree-element header">
      <div class="name">{{ mainNumber }}</div>
    </div>
    <div
      class="tpr-tree-element"
      :class="{ active: tpr.ID === choosedRow.ID }"
      v-for="tpr in editableCollection.rowsWithSameMainNumber"
      :key="tpr.ID"
    >
      <div class="name" @click="clickHandler(tpr)">
        {{ tpr.numberContract_None || 'Без номера договора' }}
      </div>
      <div
        class="tpr-tree-element"
        :class="{ active: sub.ID === choosedRow.ID }"
        v-for="sub in tpr.subs"
        :key="sub.ID"
      >
        <div class="name" @click="clickHandler(sub)">
          {{ sub.genwork_CalendarPlan ? 'ген.' : 'суб.' }}
          {{ sub.numberContract_None || 'Без номера договора' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { computed } from 'vue'

const props = defineProps<{
  editableCollection: {
    currentRow: TprStandart
    rowsWithSameMainNumber: TprStandart[]
  }
  choosedRow: TprStandart
}>()
const emit = defineEmits<{
  (e: 'elementClicked', data: TprStandart): void
}>()

const mainNumber = computed(
  () =>
    props.editableCollection.currentRow.connection?.mainNumber ||
    props.editableCollection.currentRow.numberContract_None ||
    'Без номера договора'
)

function clickHandler(tpr: TprStandart) {
  emit('elementClicked', tpr)
}
</script>
<style lang="scss">
.tpr-card-contracts-tree {
  height: 100%;
}
.tpr-tree-element {
  padding: 5px 0;
  padding-left: 20px;
  overflow: hidden;
  &.header {
    padding-left: 0;
  }
  .name {
    font-size: 14px;
    word-break: break-all;
    cursor: pointer;
  }
  &.active > .name {
    text-decoration: underline;
    font-weight: 600;
  }
  & .name::before {
    content: '';
    border-left: 1px solid #aeaeae;
    border-bottom: 1px solid #aeaeae;
    height: calc(50% + 5px);
    width: 10px;
    position: absolute;
    left: -15px;
    top: -5px;
  }

  &::before {
    content: '';
    border-left: 1px solid #aeaeae;
    position: absolute;
    height: 100%;
    left: 5px;
    top: 0;
  }
  &:last-child::before {
    display: none;
  }
  &.header::before {
    display: none;
  }
}
</style>
@/interfaces/supp-entities/tpr-standart.interface