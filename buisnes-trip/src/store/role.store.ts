import type { UserInfo } from '@/interfaces/user-info.interface'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export type UserStatus = {
  date_changed: string
  deleted: boolean
  deleted_by: string | null
  id: number
  is_editing: boolean
  modified_by: string | null
  'user.deleted': boolean
  'user.deleted_by': string | null
  'user.fio': string
  'user.modified_by': string | null
  'user.sr_id': string
  'user.user_role.user_role_name': string
  'user.user_role_id': number
  'user.username': string
  user_id: number
  'version.admin_user_id': string | null
  'version.comment': string | null
  'version.date_end': string
  'version.deleted': boolean
  'version.deleted_by': string | null
  'version.is_actual': boolean
  'version.modified_by': string | null
  'version.name': string
  'version.version_status.deleted': boolean
  'version.version_status.deleted_by': string | null
  'version.version_status.modified_by': string | null
  'version.version_status.name': string
  'version.version_status_id': number
  version_id: number
}

export const roleStore = defineStore('roleStore', () => {
  const userInfo: Ref<UserInfo | null> = ref(null)
  const userName = computed(() => userInfo.value?.username || '')
  const isAdmin = computed(() => userInfo.value?.user_role_id === 1)
  const isCurator = computed(() => userInfo.value?.user_role_id === 2)
  const isEconomist = computed(() => userInfo.value?.user_role_id === 3)
  const isManager = computed(() => userInfo.value?.user_role_id === 4)
  const isUser = computed(
    () => isAdmin.value || isCurator.value || isEconomist.value || isManager.value
  )
  const userStatus = ref<null | UserStatus>(null)
  const isEditingOpened = computed(() => userStatus.value?.is_editing === true || false)

  return {
    isAdmin,
    isCurator,
    isEconomist,
    isManager,
    isUser,
    userInfo,
    isEditingOpened,
    userStatus,
    userName
  }
})
