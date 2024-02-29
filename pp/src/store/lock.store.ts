import type { KeycloakInstance } from 'keycloak-js'
import { defineStore } from 'pinia'
import { computed, inject, ref } from 'vue'

export type LockData = {
  id: number
  date: string
  userName: string
  userId: string
  userEmail: string
  isLocked: boolean
  isAll: boolean
}

export const useLockStore = defineStore('lockStore', () => {
  const keycloak = inject('keycloak') as KeycloakInstance
  const isSystemLocked = computed(() => lockData.value?.isLocked || false)
  const lockData = ref<null | LockData>(null)

  function setLockData(data: LockData) {
    lockData.value = data
  }

  const canEditSupp = computed(() => {
    if (keycloak.hasResourceRole('admin', 'supp') || keycloak.hasResourceRole('economist', 'supp'))
      return true
    if (isSystemLocked.value) return false
    return true
  })

  const isAdmin = computed(() => keycloak.hasResourceRole('admin', 'supp'))
  const isEconomist = computed(() => keycloak.hasResourceRole('economist', 'supp'))
  const isCurator = computed(() => keycloak.hasResourceRole('curator', 'supp'))
  const isUser = computed(() => keycloak.hasResourceRole('supp_user', 'supp'))
  const isZgd = computed(() => keycloak.hasResourceRole('zgd', 'supp'))

  return {
    isSystemLocked,
    lockData,
    setLockData,
    canEditSupp,
    isAdmin,
    isEconomist,
    isCurator,
    isUser,
    isZgd,
    keycloak
  }
})
