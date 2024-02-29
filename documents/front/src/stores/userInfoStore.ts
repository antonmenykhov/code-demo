import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Keycloak from 'keycloak-js'

export const useUserInfoStore = defineStore('userInfo', () => {
  const keycloak = ref<Keycloak>()

  const name = computed(() => keycloak.value?.tokenParsed?.family_name)
  const token = computed(() => keycloak.value?.token)
  const isManager = computed(() => keycloak.value?.hasResourceRole('Manager', 'documents') || false)
  const isWorker = computed(() => keycloak.value?.hasResourceRole('Worker', 'documents') || false)
  const isInitier = computed(() => keycloak.value?.hasResourceRole('Initier', 'documents') || false)
  const myId = computed(() => keycloak.value?.tokenParsed?.sub || '')

  return { keycloak, isManager, isWorker, isInitier, myId, token, name }
})
