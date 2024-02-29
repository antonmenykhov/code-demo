import { baseUrl } from '@/config/baseUrl'
import type { Version } from '@/interfaces/version.interface'
import type { AxiosInstance } from 'axios'
import { defineStore } from 'pinia'
import { computed, inject, ref } from 'vue'

export const versionStore = defineStore('versionStore', () => {
  const version = ref<Version | undefined>()
  const versionName = computed(() => `Текущая версия данных: ${version.value?.name}`)
  function getVersion(http: AxiosInstance) {
    http.get<Version>(`${baseUrl}/get_actual_version`).then(({ data }) => {
      version.value = data
    })
  }
  return { version, versionName, getVersion }
})
