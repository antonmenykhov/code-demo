<template>
  <div class="manage-buttons" v-if="row._rawRow?.state">
    <ButtonComponent
      v-if="showProcessButtons && !row._rawRow?.state.name.includes('ОСТРиМК')"
      type="success"
      icon-class="fa-solid fa-check"
      reverse
      text="Согласовать"
      @click="nextState"
    />
    <ButtonComponent
      v-if="showProcessButtons"
      type="danger"
      icon-class="fa-solid fa-close"
      reverse
      text="Вернуть"
      @click="returnState"
    />
    <ButtonComponent
      v-if="showProlongationButton"
      reverse
      text="Продлить"
      icon-class="fa-solid fa-clock"
      @click="
        () => {
          showProlongationPopup = true
        }
      "
    />
    <ButtonComponent
      v-if="showImproovedButton"
      reverse
      type="success"
      text="Доработано"
      icon-class="fa-solid fa-check"
      @click="nextState"
    />
    <PopupComponent
      height="335px"
      width="500px"
      v-model:visible="showProlongationPopup"
      title="Запрос на продление срока"
    >
      <div class="prolongation-form">
        <DatePicker v-model:value="date" label="Новый срок" />
        <TextAreaInput
          :show-counter="false"
          v-model:value="reason"
          label="Причина переноса"
          :rows="3"
        />
        <ButtonComponent text="Отправить" @click="addProlongation" />
      </div>
    </PopupComponent>
    <ButtonComponent
      v-if="showProlongationHistoryButton"
      reverse
      text="Изменение срока"
      icon-class="fa-solid fa-clock"
      @click="
        () => {
          showProlongationHistoryPopup = true
        }
      "
    />
    <PopupComponent
      v-if="currentProlongation"
      title="Запрошено изменения срока исполнения"
      v-model:visible="showProlongationHistoryPopup"
      height="453px"
      width="800px"
    >
      <div class="prolongation-history">
        <div class="left">
          <h3>История запросов на продление срока</h3>
          <TableComponent
            css-class="prolongation-table"
            allow-filter
            :rows="prolongations"
            :columns="prolongationTableColumns"
          />
        </div>
        <div class="right">
          <h3>Текущий запрос</h3>
          <DatePicker :value="`${row._rawRow.dateFinish}`" label="Текущий срок" disabled />
          <DatePicker :value="currentProlongation.date" label="Новый срок" disabled />
          <TextAreaInput
            :value="currentProlongation.reason"
            label="Обоснование"
            :show-counter="false"
            :rows="3"
            disabled
          />
          <div class="buttons">
            <ButtonComponent text="Согласовать" type="success" @click="aproove" />
            <ButtonComponent text="Отклонить" type="danger" @click="returnState" />
          </div>
        </div>
      </div>
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import baseUrl from '@/config/baseUrl'
import type { ActionReportRow } from '@/interfaces/action-report-row.interface'
import type { AxiosInstance } from 'axios'
import {
  ButtonComponent,
  DatePicker,
  PopupComponent,
  TableComponent,
  TextAreaInput,
  type Column
} from 'tnnc-ui-kit'
import { computed, ref } from 'vue'

const props = defineProps<{
  row: ActionReportRow & { _rawRow: ActionReportRow }
  meta: {
    isResponsible: boolean
    isAdministrator: boolean
    isManager: boolean
    http: AxiosInstance
  }
}>()
const showProcessButtons = computed(() => {
  const { row, meta } = props
  if (row._rawRow.state.isProlongationState) return false
  if (meta.isManager && row._rawRow.state.whoCanChangeState === 'MANAGER') return true
  if (meta.isAdministrator && row._rawRow.state.whoCanChangeState === 'ADMINISTRATOR') return true
  return false
})
const showProlongationButton = computed(() => {
  const { row, meta } = props
  if (
    meta.isResponsible &&
    row._rawRow.state.whoCanChangeState === 'RESPONSIBLE' &&
    row._rawRow.state.prolongationOpened
  )
    return true
  return false
})
const showImproovedButton = computed(() => {
  const { row, meta } = props
  if (
    meta.isResponsible &&
    row._rawRow.state.whoCanChangeState === 'RESPONSIBLE' &&
    row._rawRow.state.isReturnedState
  )
    return true
  return false
})
function createUpdateCommand() {
  const event = new Event('need-update-rows')
  document.dispatchEvent(event)
}
async function nextState() {
  const { meta, row } = props
  const { http } = meta
  http.post(`${baseUrl.baseUrl}/action/status/next/${row._rawRow.correctAction?.id}`).then(() => {
    createUpdateCommand()
  })
}
async function returnState() {
  const { meta, row } = props
  const { http } = meta
  http.post(`${baseUrl.baseUrl}/action/status/return/${row._rawRow.correctAction?.id}`).then(() => {
    createUpdateCommand()
    showProlongationHistoryPopup.value = false
  })
}

async function aproove() {
  const { meta, row } = props
  const { http } = meta
  http
    .post(`${baseUrl.baseUrl}/action/prolongation/aproove/${row._rawRow.correctAction?.id}`)
    .then(() => {
      createUpdateCommand()
      showProlongationHistoryPopup.value = false
    })
}

async function addProlongation() {
  const { meta, row } = props
  const { http } = meta
  http
    .post(`${baseUrl.baseUrl}/action/prolongation/add/${row._rawRow.correctAction?.id}`, {
      reason: reason.value,
      date: date.value
    })
    .then(() => {
      createUpdateCommand()
      reason.value = ''
      showProlongationPopup.value = false
    })
}

const showProlongationPopup = ref(false)
const date = ref(JSON.parse(JSON.stringify(new Date())))
const reason = ref('')

const showProlongationHistoryButton = computed(() => {
  const { row, meta } = props

  if (
    meta.isManager &&
    row._rawRow.state.whoCanChangeState === 'MANAGER' &&
    row._rawRow.state.isProlongationState
  )
    return true
  return false
})

const showProlongationHistoryPopup = ref(false)
const prolongations = computed(() =>
  props.row._rawRow.prolongations.map((a) => a).sort((a, b) => a.id - b.id)
)
const currentProlongation = computed(() =>
  prolongations.value.length > 0 ? prolongations.value[prolongations.value.length - 1] : undefined
)
const prolongationTableColumns: Column[] = [
  {
    name: 'date',
    columnType: 'date',
    caption: 'Новый срок'
  },
  {
    name: 'reason',
    columnType: 'string',
    caption: 'Обоснование'
  },
  {
    name: 'aprooved',
    columnType: 'boolean',
    caption: 'Утверждено',
    trueValue: 'Да',
    falseValue: 'Нет'
  }
]
</script>
<style lang="scss">
.manage-buttons {
  display: flex;
  flex-direction: column;
  gap: 5px;
  .tnnc-button {
    padding: 5px;
    font-size: 12px;
    width: 100%;
    gap: 3px;
    border-radius: 20px;
  }
}
.prolongation-form {
  padding: 10px;
  background: var(--tnnc-color-gray-light);
  display: flex;
  flex-direction: column;
  gap: 5px;
  .tnnc-button {
    align-self: flex-start;
  }
}
.prolongation-history {
  h3 {
    text-align: center;
  }
  display: flex;
  gap: 10px;
  padding: 10px;
  overflow: hidden;
  background: var(--tnnc-color-gray-light);
  & > div {
    flex: 1;
  }
  .right {
    .tnnc-input-labeled {
      margin-bottom: 7px;
    }
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
  }
  .prolongation-table {
    height: 250px;
  }
}
</style>
