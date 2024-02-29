<template>
  <div
    class="service-staff-tree-element"
    :style="`padding-left: ${(department.level - 1) * 20}px`"
    :class="{
      hided: isHidded
    }"
  >
    <ButtonComponent
      icon-class="fa-solid fa-chevron-down"
      css-class="expand-button"
      :class="{
        hidden: !(department.child && department.child.length > 0),
        rotated: isCollapsed
      }"
      @click="toggleExpandGroup"
    />
    <Toggle
      v-if="department.level > 1"
      :label="department.name"
      :value="isSelected"
      :disabled="isExcluded"
      @update:value="toggleSelected"
    />
    <div v-else>{{ department.name }}</div>
  </div>
</template>
<script lang="ts" setup>
import type { Department } from '@/interfaces/department.interface'
import { ButtonComponent, Toggle } from '@tnnc/tnnc-ui-kit'
import { computed } from 'vue'

const props = defineProps<{
  department: Department
  excludedDepartmentIds: string[]
  selectedDepartmentIds: string[] | null
  expandedDepartment: Department[]
  collapsedDepartmentIds: string[]
}>()

const emit = defineEmits<{
  (e: 'setSelected', data: { isAdded: boolean; id: string }): void
  (e: 'toggleExpandGroup', department: Department): void
}>()

const isSelected = computed(
  () => props.selectedDepartmentIds?.includes(props.department.id) || false
)
const isExcluded = computed(() => props.excludedDepartmentIds.includes(props.department.id))
const isCollapsed = computed(() =>
  props.expandedDepartment.some((dep) => dep.id === props.department.id)
)
const isHidded = computed(() => props.collapsedDepartmentIds.includes(props.department.id))

function toggleSelected(isAdded: boolean) {
  emit('setSelected', { isAdded, id: props.department.id })
}

function toggleExpandGroup() {
  emit('toggleExpandGroup', props.department)
}
</script>
<style lang="scss">
.service-staff-tree-element {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 33px;
  transition: all 0.2s;
  overflow: hidden;
  .tnnc-toggle {
    flex: 1;
  }
  &.hided {
    height: 0px;
    opacity: 0;
  }
}
.expand-button {
  padding: 1px;
  height: 20px;
  i {
    font-size: 10px;
  }
  &.hidden {
    visibility: hidden;
  }
  &.rotated {
    transform: rotate(-90deg);
  }
}
</style>
