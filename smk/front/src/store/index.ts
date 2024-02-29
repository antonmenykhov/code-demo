import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export const useRoleStore = defineStore('roleStore', () => {
  const roles: Ref<string[]> = ref([])
  const isAdministrator = computed(() => roles.value.includes('ADMINISTRATOR'))
  const isManager = computed(() => roles.value.includes('MANAGER'))
  const isResponsible = computed(() => roles.value.includes('RESPONSIBLE'))
  const isRespondent = computed(() => roles.value.includes('RESPONDENT'))
  return { roles, isAdministrator, isManager, isRespondent, isResponsible }
})
