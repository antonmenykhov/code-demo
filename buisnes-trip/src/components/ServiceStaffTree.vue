<template>
  <div class="service-staff-tree">
    <TextInput
      v-model:value="searchPhrase"
      label="Поиск по подразделениям"
      placeholder="Поиск..."
      show-clear-button
      style="margin-bottom: 10px"
    />
    <ServiceStaffTreeElement
      v-for="department in departmentTreeFiltered"
      :key="department.id"
      :department="department"
      :excluded-department-ids="excludedDepartmentIds"
      :selected-department-ids="selectedDepartmentIds"
      :expanded-department="expandedDepartment"
      :collapsed-department-ids="collapsedDepartmentIds"
      @set-selected="setSelected"
      @toggle-expand-group="toggleExpandGroup"
    />
  </div>
</template>
<script lang="ts" setup>
import type { Department } from '@/interfaces/department.interface'
import ServiceStaffTreeElement from './ServiceStaffTreeElement.vue'
import { TextInput } from '@tnnc/tnnc-ui-kit'
import { computed, ref, onMounted } from 'vue'
import { useDebounce } from '@vueuse/core'

const props = defineProps<{
  departmentsTree: Department[]
  excludedDepartmentIds: string[]
  selectedDepartmentIds: string[] | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedDepartmentIds', data: string[]): void
}>()

function setSelected(data: { isAdded: boolean; id: string }) {
  let newSelectedDeaprtmentIds = props.selectedDepartmentIds || []
  if (data.isAdded) {
    newSelectedDeaprtmentIds.push(data.id)
  } else {
    newSelectedDeaprtmentIds = newSelectedDeaprtmentIds.filter((id) => id !== data.id)
  }
  emit('update:selectedDepartmentIds', newSelectedDeaprtmentIds)
}

const searchPhrase = ref('')
const searchPhraseDebounced = useDebounce(searchPhrase, 150)
const departmentTreeFiltered = computed(() => {
  const visibleDepartments: Department[] = []

  ;[...props.departmentsTree].reverse().forEach((department) => {
    if (
      department.name.toLowerCase().includes(searchPhraseDebounced.value.toLowerCase()) ||
      visibleDepartments.some((dep) => dep.parentId === department.id)
    ) {
      visibleDepartments.push(department)
    }
  })

  return visibleDepartments.reverse()
})

const expandedDepartment = ref<Department[]>([])
function toggleExpandGroup(department: Department) {
  if (expandedDepartment.value.find((dep) => dep.id === department.id)) {
    expandedDepartment.value = expandedDepartment.value.filter((dep) => dep.id !== department.id)
  } else {
    expandedDepartment.value.push(department)
  }
}

const collapsedDepartmentIds = computed(() =>
  expandedDepartment.value.reduce<string[]>((acc, department) => {
    if (department.child) acc.push(...getDepartments(department.child).map((dep) => dep.id))
    return acc
  }, [])
)

function getDepartments(departments: Department[]) {
  const deps: Department[] = []
  departments.forEach((department) => {
    deps.push(department)
    if (department.child) deps.push(...getDepartments(department.child))
  })
  return deps
}

onMounted(() => {
  props.departmentsTree.filter((department) => department.level === 1).map(toggleExpandGroup)
})
</script>
