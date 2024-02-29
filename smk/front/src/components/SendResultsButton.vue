<template>
  <div>
    <ButtonComponent
      v-if="periodId"
      text="Рассылка результатов"
      @click="
        () => {
          popupVisible = true
        }
      "
    />
    <PopupComponent
      v-model:visible="popupVisible"
      title="Рассылка результатов"
      width="350px"
      height="280px"
    >
      <div class="send-result-form">
        <DatePicker v-model:value="dateInput" label="Срок предоставления КД" />
        <DatePicker v-model:value="dateQuestions" label="Срок уточнения информации" />
        <ButtonComponent text="Отправить результаты" @click="sendResults" />
      </div>
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import baseUrl from '@/config/baseUrl'
import type { AxiosInstance } from 'axios'
import { ButtonComponent, DatePicker, PopupComponent } from 'tnnc-ui-kit'
import { inject, ref } from 'vue'

const http = inject('http') as AxiosInstance
const props = defineProps<{
  periodId: number | null
}>()
const popupVisible = ref(false)
const dateInput = ref(JSON.parse(JSON.stringify(new Date())))
const dateQuestions = ref(JSON.parse(JSON.stringify(new Date())))

function sendResults() {
  http
    .post(`${baseUrl.baseUrl}/emailer/results`, {
      dateInput: dateInput.value,
      dateQuestions: dateQuestions.value,
      periodId: props.periodId
    })
    .then(() => {
      popupVisible.value = false
    })
}
</script>
<style lang="scss">
.send-result-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  .tnnc-button {
    margin-top: 10px;
  }
}
</style>
