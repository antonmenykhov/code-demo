<template>
  <div>
    <ButtonComponent v-if="isVisible" text="Уведомление о доработках" @click="showPopup" />
    <PopupComponent
      v-model:visible="isPopupVisible"
      title="Уведомление о доработках"
      close-on-outside-click
      @update:visible="
        (value:boolean) => {
          if (!value) isTableVisible = false
        }
      "
    >
      <TableComponent
        v-if="isTableVisible"
        :rows="groupsForReturning"
        allow-selection
        :columns="columns"
        @selection-changed="setSelection"
        css-class="popup-table"
      />
      <ButtonComponent
        :disabled="selectedGroups.length === 0"
        text="Отправить уведомления"
        @click="sendNotification"
      />
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import baseUrl from '@/config/baseUrl'
import type { ActionReportRow } from '@/interfaces/action-report-row.interface'
import type { QuestionGroup } from '@/interfaces/question-group.interface'
import type { AxiosInstance } from 'axios'
import { ButtonComponent, PopupComponent, TableComponent, type Column } from 'tnnc-ui-kit'
import { computed, inject, ref } from 'vue'

const props = defineProps<{
  rows: ActionReportRow[]
}>()
const isVisible = computed(() => rowsForReturning.value.length > 0)
const rowsForReturning = computed(() => props.rows.filter((row) => row.state?.isReturnedState))
const groupsForReturning = computed(() => {
  const groups: QuestionGroup[] = []
  rowsForReturning.value.forEach((row) => {
    if (!groups.find((group) => group.id === row.question.group.id)) groups.push(row.question.group)
  })
  return groups
})
const isPopupVisible = ref(false)
const isTableVisible = ref(false)
const http = inject('http') as AxiosInstance
const columns: Column[] = [{ name: 'name', caption: 'Подразделение', columnType: 'string' }]
const selectedGroups = ref<number[]>([])
function showPopup() {
  isPopupVisible.value = true
  setTimeout(() => {
    isTableVisible.value = true
  }, 200)
}
function setSelection(data: Set<string>) {
  selectedGroups.value = Array.from(data).map((value) => +value)
}
function sendNotification() {
  isPopupVisible.value = false
  isTableVisible.value = false
  http.post(`${baseUrl.baseUrl}/emailer/returns`, { groups: selectedGroups.value })
  selectedGroups.value = []
}
</script>
<style lang="scss">
.popup-table {
  height: 360px;
}
</style>
