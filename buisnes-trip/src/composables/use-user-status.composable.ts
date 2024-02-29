import { baseUrl } from '@/config/baseUrl'
import { roleStore, type UserStatus } from '@/store/role.store'
import type { AxiosInstance } from 'axios'
import { storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

export type UserStatusReportItem = {
  date: string | null
  department_name: string
  fio: string
  status: string
  data_changed: boolean
}

export default function useUserStatus(initHttp?: AxiosInstance) {
  const injectedHttp = inject('http') as AxiosInstance
  const http = initHttp ? initHttp : injectedHttp
  const { userStatus, isAdmin, isEconomist, isEditingOpened } = storeToRefs(roleStore())

  async function getUserStatus() {
    return http.get<UserStatus>(`${baseUrl}/get_user_status`).then(({ data }) => {
      userStatus.value = data
    })
  }

  async function toggleIsEditing() {
    return http
      .put(`${baseUrl}/set_user_status`, { is_editing: !userStatus.value?.is_editing })
      .then(() => {
        getUserStatus()
      })
  }

  const userStatusReport = ref<UserStatusReportItem[]>([])
  async function getUserStatusReport() {
    return http.get(`${baseUrl}/show_exit_form_user_statues`).then(({ data }) => {
      userStatusReport.value = data
    })
  }

  const router = useRouter()
  function checkStatusForCard() {
    if (!isAdmin.value && !isEconomist.value && !isEditingOpened.value) {
      router.push({ path: '/' })
    }
  }

  return {
    getUserStatus,
    toggleIsEditing,
    getUserStatusReport,
    userStatusReport,
    checkStatusForCard
  }
}
