import { base_url } from '@/config/urls'
import { useUserInfoStore } from '@/stores/userInfoStore'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'

export default function useHttp() {
  const { token } = storeToRefs(useUserInfoStore())
  const http = axios.create({
    baseURL: base_url,
    headers: { Authorization: `Bearer ${token.value}` }
  })
  http.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response.status >= 400) {
        if (error.response.data.message) {
          message.error(error.response.data.message)
        } else {
          message.error('Ошибка при выполнении запроса')
        }
      }
      return Promise.reject(error)
    }
  )
  return { http }
}
