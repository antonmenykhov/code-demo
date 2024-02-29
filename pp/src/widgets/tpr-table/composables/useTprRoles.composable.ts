import type { Department } from '@/interfaces/supp-entities/department.interface'
import { useHandbookStore } from '@/store/handbooks.store'
import type { KeycloakInstance } from 'keycloak-js'
import { computed, inject } from 'vue'
import { storeToRefs } from 'pinia'
import useHandbooks from '@/widgets/handbooks/composables/useHandbooks.composable'

export default function useTprRoles() {
  const { handbooks } = storeToRefs(useHandbookStore())
  if (handbooks.value.department.length === 0) {
    const { getAllHandbookNew } = useHandbooks()
    getAllHandbookNew()
  }
  const keycloak = inject('keycloak') as KeycloakInstance
  const availableDepartments = computed(() => {
    if (keycloak.hasResourceRole('admin', 'supp') || keycloak.hasResourceRole('economist', 'supp'))
      return handbooks.value.department
    let departments: Department[] = []
    const getCuratorName = (fullName: string) => {
      const curatorNameArr = fullName.split(' ')
      if (curatorNameArr.length > 2) {
        return `${curatorNameArr[0]} ${curatorNameArr[1].charAt(0)}.${curatorNameArr[2].charAt(0)}.`
      } else {
        return null
      }
    }
    if (
      keycloak.hasResourceRole('curator', 'supp') ||
      keycloak.hasResourceRole('sub_curator', 'supp')
    ) {
      const availableCurators = new Set()
      if (keycloak.hasResourceRole('sub_curator', 'supp')) {
        keycloak.tokenParsed?.managerName.forEach((name: string) => {
          availableCurators.add(getCuratorName(name))
        })
      } else {
        availableCurators.add(getCuratorName(keycloak.tokenParsed?.family_name))
      }
      const curators = handbooks.value.curatorDepartment.filter((elem) =>
        availableCurators.has(elem.name)
      )
      departments = handbooks.value.department.filter((dep) =>
        curators.find((cur) => cur.id === dep.curatorDepartmentId)
      )
    }
    return departments
  })
  return { availableDepartments }
}
