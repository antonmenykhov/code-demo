import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import type { KeycloakInstance } from 'keycloak-js'
import { computed, inject, type ComputedRef } from 'vue'

export default function useCardDisabledFields(
  row: ComputedRef<TprStandart | null>,
  editable: ComputedRef<boolean>,
  year: ComputedRef<number>
) {
  const keycloak = inject('keycloak') as KeycloakInstance
  const all = computed(() => Object.keys(row.value || {}) as (keyof TprStandart)[])
  const disabledForCuratorAlways: (keyof TprStandart)[] = [
    'opex_CalendarPlan',
    'department_Staff_Project'
  ]
  const disabledForCuratorIfHasBpGen: (keyof TprStandart)[] = [
    'kindWork_Business_Project',
    'directWork_Business_Project',
    'customer_Staff_Project',
    'department_Staff_Project'
  ]
  const disabledForCuratorIfHasBpSub: (keyof TprStandart)[] = [
    'kindWork_Business_Project',
    'directWork_Business_Project',
    'department_Staff_Project',
    'opex_CalendarPlan'
  ]
  const disabledFieldsForCurator = computed<(keyof TprStandart)[]>(() => {
    const disabledKeysArray: (keyof TprStandart)[] = []
    disabledKeysArray.push(...disabledForCuratorAlways)
    if (row.value && row.value.genwork_CalendarPlan && row.value.generalEplan_None > 0)
      disabledKeysArray.push(...disabledForCuratorIfHasBpGen)
    if (row.value && !row.value.genwork_CalendarPlan && row.value.subEplan_None > 0)
      disabledKeysArray.push(...disabledForCuratorIfHasBpSub)
    return disabledKeysArray
  })

  const disabledIfSub: (keyof TprStandart)[] = [
    'kindWork_Business_Project',
    'directWork_Business_Project',
    'department_Staff_Project'
  ]

  const disabledIfGen: (keyof TprStandart)[] = [
    'scopeWorkSubcontract_None',
    'reasonWorkSubcontract_None'
  ]
  const keysForOneYearChange = [
    'status_CommentBlock',
    'general_CommentBlock',
    'deviationContract_CommentBlock',
    'deviationPlan_CommentBlock',
    'rate_CommentBlock',
    'statusCalendarPlanId_CalendarPlan',
    'risk_CalendarPlan',
    'ndsId_CalendarPlan',
    'totalContract_CalendarPlan',
    'discountEconomySelf_GeneralForcesFactor',
    'cancellWork_GeneralForcesFactor',
    'transferWork_GeneralForcesFactor',
    'revisionWork_GeneralForcesFactor',
    'closeCosts_GeneralForcesFactor',
    'reduceTender_GeneralForcesFactor',
    'operationKNIPI_GeneralForcesFactor',
    'comments_GeneralForcesFactor',
    'discountEconomySelf_OwnForcesFactor',
    'cancellWork_OwnForcesFactor',
    'transferWork_OwnForcesFactor',
    'revisionWork_OwnForcesFactor',
    'moveSelf_OwnForcesFactor',
    'operationKNIPI_OwnForcesFactor',
    'comments_OwnForcesFactor',
    'monitoringUnplannedWork_GhostCalendarPlan'
  ]
  const disabledForOtherYears = computed<(keyof TprStandart)[]>(() =>
    (Object.keys(row.value || {}) as (keyof TprStandart)[]).filter(
      (key) => !key.includes('_mounth')
    )
  )

  const disabledForOneYearChange = computed<(keyof TprStandart)[]>(() =>
    (Object.keys(row.value || {}) as (keyof TprStandart)[]).filter(
      (key) => !key.includes('_mounth') && !keysForOneYearChange.includes(key)
    )
  )

  const disabledKeys = computed<(keyof TprStandart)[]>(() => {
    if (editable.value === false) return all.value
    const arr: (keyof TprStandart)[] = []
    if (
      keycloak.hasResourceRole('curator', 'supp') ||
      keycloak.hasResourceRole('sub_curator', 'supp')
    )
      arr.push(...disabledFieldsForCurator.value)
    if (!row.value?.genwork_CalendarPlan) arr.push(...disabledIfSub)
    if (row.value?.connection) arr.push('numberContract_None')
    if (row.value?.genwork_CalendarPlan) arr.push(...disabledIfGen)
    const currentYear = new Date().getFullYear()
    if (year.value === currentYear + 1 || year.value === currentYear - 1)
      arr.push(...disabledForOneYearChange.value)
    if (year.value > currentYear + 1 || year.value < currentYear - 1)
      arr.push(...disabledForOtherYears.value)
    return arr
  })

  return { disabledKeys }
}
