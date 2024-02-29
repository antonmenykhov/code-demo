import { requestStore } from '@/store/request.store'
import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { KeycloakInstance } from 'keycloak-js'

export default function useHttp(
  keycloak?: KeycloakInstance,
  notify?: (
    text: string,
    type?: 'danger' | 'success' | undefined,
    duration?: number | undefined
  ) => void,
  silent = false
) {
  const { increment, decrement } = requestStore()
  const http = axios.create()
  http.interceptors.request.use(
    (config) => {
      const newConfig = {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${keycloak?.token}` }
      }
      increment()
      return newConfig as InternalAxiosRequestConfig<any>
    },
    (error) => Promise.reject(error)
  )

  http.interceptors.response.use(
    (response) => {
      decrement()
      if (
        notify &&
        silent !== true &&
        (response.config.method === 'delete' ||
          response.config.method === 'patch' ||
          response.config.method === 'post' ||
          response.config.method === 'put')
      ) {
        notify('Успешно', 'success', 3000)
      }
      return response
    },
    (error) => {
      decrement()
      if (notify) notify('Произошла ошибка', 'danger', 3000)
      return Promise.reject(error)
    }
  )

  return { http }
}
