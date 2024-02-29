import type { FakeKeycloakClass } from '@/services/keycloack/fake-plugin'
import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { KeycloakInstance } from 'keycloak-js'

export default function useHttp(
  keycloak?: KeycloakInstance | FakeKeycloakClass,
  notify?: (
    text: string,
    type?: 'success' | 'danger' | undefined,
    duration?: number | undefined
  ) => void,
  silent = false
) {
  const http = axios.create()
  http.interceptors.request.use(
    (config) => {
      const newConfig = {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${keycloak?.token}` }
      }

      return newConfig as InternalAxiosRequestConfig<any>
    },
    (error) => Promise.reject(error)
  )
  if (notify && silent === false)
    http.interceptors.response.use(
      (response) => {
        if (
          response.config.method === 'delete' ||
          response.config.method === 'patch' ||
          response.config.method === 'post' ||
          response.config.method === 'put'
        ) {
          notify('Успешно')
        }
        return response
      },
      (error) => {
        notify('Произошла ошибка', 'danger')
        return Promise.reject(error)
      }
    )

  return { http }
}
