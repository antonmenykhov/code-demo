<template>
  <div class="fin-structure-service-staff-cell">
    {{ value }}
    <ButtonComponent text="Изменить" @click="openPopup" style="margin-top: 5px" />
    <PopupComponent
      title="Отметьте нужные подразделения"
      v-model:visible="isPopupVisible"
      height="100vh"
      width="1000px"
      close-on-outside-click
    >
      <ServiceStaffTree
        :departments-tree="departmentsTreeWithDirectors"
        :selected-department-ids="row.department_ids_sr"
        :excluded-department-ids="excludedDepartmentIds"
        @update:selected-department-ids="setSelectedDepartmentIds"
      />
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import type { FinStructure } from '@/interfaces/fin-structure.interface'
import { handbooksStore } from '@/store/hanbooks.store'
import { storeToRefs } from 'pinia'
import { ButtonComponent, PopupComponent, type Column, type TableRow } from '@tnnc/tnnc-ui-kit'
import { computed, inject, ref } from 'vue'
import ServiceStaffTree from './ServiceStaffTree.vue'
import type { Department } from '@/interfaces/department.interface'
import type { DirectorOfDeparment } from '@/interfaces/director-of-department.interface'

const { departmnetsTree, departments, directorsOfDepartment } = storeToRefs(handbooksStore())

const props = defineProps<{
  isEditing?: boolean
  column: Column
  row: TableRow<FinStructure>
  masterDetailOpened: Set<string>
  selectedRowsIds: Set<string>
  hasInvalidValues?: boolean
  meta?: {
    rows: FinStructure[]
  }
}>()
const value = computed(() =>
  props.row.department_ids_sr
    ?.map(
      (depId) =>
        departments.value.find((dep) => dep.id === depId)?.name ||
        directorsOfDepartment.value.find((director) => director.staffDepartmentId === depId)
          ?.nameStaff ||
        ''
    )
    .join(', ')
)
const setRow = inject('setRow') as (newRow: TableRow) => void

function setSelectedDepartmentIds(selectedDepartmentIds: string[]) {
  setRow({ ...props.row, department_ids_sr: selectedDepartmentIds })
}

const isPopupVisible = ref(false)
function openPopup() {
  isPopupVisible.value = true
}
const excludedDepartmentIds = computed(
  () =>
    props.meta?.rows?.reduce<string[]>((acc, row) => {
      if (row.department_ids_sr && row.id !== props.row.id) {
        acc.push(...row.department_ids_sr)
      }

      return acc
    }, []) || []
)

function getDepartments(departments: Department[]) {
  const deps: Department[] = []
  departments.forEach((department) => {
    deps.push(department)
    if (department.child) deps.push(...getDepartments(department.child))
  })
  return deps
}

const departmentsTreePlained = computed(() => {
  return getDepartments(departmnetsTree.value)
})

const departmentsTreeWithDirectors = computed(() => {
  const departments: Department[] = JSON.parse(JSON.stringify(departmentsTreePlained.value))
  departments[0].name = 'Штатное расписание'

  const directors: Department[] = directorsOfDepartment.value
    .reduce<DirectorOfDeparment[]>((acc, director) => {
      const existCurrentDirector = acc.some(
        (existDirector) => existDirector.staffDepartmentId === director.staffDepartmentId
      )
      if (!existCurrentDirector) acc.push(director)
      return acc
    }, [])
    .map((director) => ({
      comment: '',
      currentId: '',
      level: 2,
      depLevel1Id: '',
      depLevel2Id: '',
      depLevel3Id: '',
      depLevel4Id: '',
      depLevel5Id: '',
      depLevel6Id: '',
      sapHrDepId: '',
      level1: '',
      level2: '',
      level3: '',
      level4: '',
      level5: '',
      level6: '',
      isActive: true,
      fullStructure: '',
      parentId: 'directors',
      parentStructureId: '',
      id: director.staffDepartmentId,
      name: director.nameStaff
    }))
  const directorDepartmentParentDep: Department = {
    child: directors,
    comment: '',
    currentId: '',
    level: 1,
    depLevel1Id: '',
    depLevel2Id: '',
    depLevel3Id: '',
    depLevel4Id: '',
    depLevel5Id: '',
    depLevel6Id: '',
    sapHrDepId: '',
    level1: '',
    level2: '',
    level3: '',
    level4: '',
    level5: '',
    level6: '',
    isActive: true,
    fullStructure: '',
    parentId: '',
    parentStructureId: '',
    id: 'directors',
    name: 'Директора по'
  }
  return [...departments, directorDepartmentParentDep, ...directors]
})
</script>
