import { computed, type Ref } from 'vue'
import { handbooksStore } from '@/store/hanbooks.store'
import type { FormInputData } from './useTripCardInOut'

export default function useTripCardComputedHandbooks(formData: Ref<FormInputData>) {
  const handbookStore = handbooksStore()
  const blockList = computed(() => {
    const blocks = new Set<string>()
    handbookStore.handbooks.fin_structures.forEach((str) => {
      blocks.add(str.block)
    })
    return Array.from(blocks)
  })

  const departmentList = computed(() => {
    const departments = new Set<string>()
    handbookStore.handbooks.fin_structures
      .filter((str) => str.block === formData.value.blockName)
      .forEach((str) => departments.add(str.department_name))
    return Array.from(departments)
  })

  const subDepartmentList = computed(() => {
    return handbookStore.handbooks.fin_structures.filter(
      (str) => str.department_name === formData.value.departmentName
    )
  })

  const mvzList = computed(() =>
    handbookStore.handbooks.fin_structures.map((fs) => ({
      ...fs,
      computedValue: `${fs.mvz_code} ${fs.mvz_name}`
    }))
  )

  const tripPurposeList = computed(() =>
    handbookStore.handbooks.trip_purposes.filter((tp) => tp.is_plan)
  )

  function setBlock(block: string) {
    formData.value.departmentName = ''
    formData.value.finStructureId = null
    formData.value.blockName = block
  }

  function setDeparment(department: string) {
    formData.value.departmentName = department
    formData.value.finStructureId =
      subDepartmentList.value.length === 1 ? subDepartmentList.value[0].id : null
  }

  return {
    blockList,
    departmentList,
    subDepartmentList,
    mvzList,
    setBlock,
    setDeparment,
    tripPurposeList
  }
}
