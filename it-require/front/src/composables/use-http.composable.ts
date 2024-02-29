import { useRequestStore } from '@/store/request.store'
import axios from 'axios'
import type { KeycloakInstance } from 'keycloak-js'
import { notify } from '@tnnc/tnnc-ui-kit'
import { inject } from 'vue'

export default function useHttp(silent = false, withLoading = true) {
  const keycloak = inject<KeycloakInstance>('keycloak')
  const { increment, decrement } = useRequestStore()
  const http = axios.create()
  http.interceptors.request.use(
    (config) => {
      config.headers.set('Authorization', `Bearer ${keycloak?.token}`)
      if (withLoading) increment()
      return config
    },
    (error) => Promise.reject(error)
  )

  http.interceptors.response.use(
    (response) => {
      if (withLoading) decrement()

      if (
        notify &&
        silent !== true &&
        ['post', 'put', 'delete', 'patch'].includes(response.config?.method || '')
      ) {
        notify('Успешно', 'success', 3000)
      }
      return response
    },
    (error) => {
      if (withLoading) decrement()
      if (notify) notify(`Произошла ошибка: ${error}`, 'danger', 3000)
      return Promise.reject(error)
    }
  )

  return { http }
}
