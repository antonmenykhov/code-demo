<template>
  <ButtonComponent v-if="isVisible" text="Согласовать за ГД" @click="aproove" />
</template>
<script lang="ts" setup>
import baseUrl from '@/config/baseUrl'
import type { ActionReportRow } from '@/interfaces/action-report-row.interface'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { ButtonComponent } from 'tnnc-ui-kit'
import { computed, inject } from 'vue'

const props = defineProps<{
  rows: ActionReportRow[]
}>()
const emit = defineEmits<{ (e: 'actionAprooved'): void }>()
const http = inject('silentHttp') as AxiosInstance

const rowsForAproove = computed(() =>
  props.rows.filter((row) => row.state?.name.includes('ОСТРиМК'))
)
const isVisible = computed(() => rowsForAproove.value.length > 0)
function aproove() {
  const promises: Promise<AxiosResponse>[] = []
  rowsForAproove.value.forEach((row) => {
    promises.push(http.post(`${baseUrl.baseUrl}/action/status/next/${row.correctAction?.id}`))
  })
  Promise.all(promises).then(() => {
    emit('actionAprooved')
  })
}
</script>
