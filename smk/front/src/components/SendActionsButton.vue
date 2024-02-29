<template>
  <div>
    <ButtonComponent
      v-if="canSendActions && periodId"
      text="Отправить КД"
      @click="sendActions"
    ></ButtonComponent>
  </div>
</template>
<script lang="ts" setup>
import baseUrl from '@/config/baseUrl'
import type { ActionReportRow } from '@/interfaces/action-report-row.interface'
import type { AxiosInstance } from 'axios'
import { ButtonComponent } from 'tnnc-ui-kit'
import { computed } from 'vue'

const props = defineProps<{
  periodId: number | null
  rows: ActionReportRow[]
  http: AxiosInstance
}>()
const emit = defineEmits<{
  (e: 'actionsSended'): void
}>()

const canSendActions = computed(() => {
  const kds = props.rows.filter((row) => row.correctAction)
  const newKds = kds.filter((kd) => kd.stateId === 1)
  if (kds.length === props.rows.length && newKds.length > 0) return true
  return false
})

async function sendActions() {
  props.http.post(`${baseUrl.baseUrl}/action/send/${props.periodId}`).then(() => {
    emit('actionsSended')
  })
}
</script>
