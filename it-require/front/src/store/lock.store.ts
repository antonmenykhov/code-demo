import type { KeycloakInstance } from 'keycloak-js'
import { defineStore } from 'pinia'
import { computed, inject, ref } from 'vue'

export const useLockStore = defineStore('lockStore', () => {
  const serviceName = ref('it_requests')
  const keycloak = ref(inject('keycloak') as KeycloakInstance)
  const myId = computed(() => keycloak.value?.tokenParsed?.sub)
  const isUapimd = computed(() => keycloak.value.hasResourceRole('uapimd', serviceName.value))
  const isCouncil = computed(() => keycloak.value.hasResourceRole('council', serviceName.value))
  const isZgd = computed(() => keycloak.value.hasResourceRole('zgd', serviceName.value))

  const canManageComments = computed(() => isUapimd.value || isCouncil.value)

  return {
    keycloak,
    myId,
    isUapimd,
    isCouncil,
    isZgd,
    canManageComments,
    serviceName
  }
})
