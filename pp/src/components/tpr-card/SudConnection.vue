<template>
  <CollapsableBlock
    title="Связь с ИС СУД"
    :collapsed="collapsed"
    @update:collapsed="
      (value) => {
        emit('update:collapsed', value)
      }
    "
  >
    <div class="row">
      <TextInput
        label="Статус связи с ИС СУД"
        :value="connectionStatus"
        css-class="standart-width "
        disabled
      />
      <ButtonComponent
        css-class="standart-width "
        :text="choosedRow.connection ? 'Отвязать' : 'Связать'"
        :disabled="isNumberContractInvalid && !choosedRow.connection"
        v-title="isNumberContractInvalid ? 'Номер договора не из СУДа, связь невозможна' : ''"
        @click="toggleConnectionHandler"
      />
    </div>
    <div class="row" v-if="choosedRow.connection">
      <TextInput
        label="Статус связи этапов"
        :value="stageStatus"
        css-class="standart-width "
        disabled
      />
      <ButtonComponent
        css-class="standart-width "
        text="Распределить"
        :disabled="stageStatus === 'Нет этапов в текущем году'"
        @click="showStageConnector"
      />
    </div>
    <div class="row button-row" v-if="choosedRow.connection">
      <ButtonComponent css-class="standart-width " text="Получить из СУД" @click="copyAllHandler" />
      <ButtonComponent
        css-class="standart-width "
        text="Копир. КП в Пр."
        @click="copyCpToPrognos"
      />
    </div>
    <div class="row button-row" v-if="choosedRow.connection">
      <ButtonComponent css-class="standart-width " text="Получить наим." @click="copyNameHandler" />
      <ButtonComponent
        css-class="standart-width "
        text="Инфо о договоре"
        @click="getContractForCard"
      />
    </div>
    <PopupComponent
      title="Карточка договора"
      :visible="contract !== undefined && isStageConnectorVisible === false"
      @update:visible="
        () => {
          contract = undefined
        }
      "
      height="95vh"
      width="95vw"
    >
      <ContractCard v-if="contract" :contract="contract" />
    </PopupComponent>
    <StageConnectorPopup
      v-if="contract"
      :year="year"
      :contract="contract"
      :tprs="tprs"
      v-model:visible="isStageConnectorVisible"
      @update:visible="
        () => {
          contract = undefined
          emit('needSave')
        }
      "
    />
  </CollapsableBlock>
</template>
<script lang="ts" setup>
import type { Contract } from '@/interfaces/contracts-entities/contract.interface'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { ButtonComponent, confirm, notify, PopupComponent, TextInput } from 'tnnc-ui-kit'
import { computed, inject, ref, type Ref } from 'vue'
import CollapsableBlock from './CollapsableBlock.vue'
import useSudConnection from '@/widgets/tpr-card/composables/useSudConnection.composable'
import ContractCard from './ContractCard.vue'
import StageConnectorPopup from './StageConnectorPopup.vue'

const props = defineProps<{
  tprs: TprStandart[]
  choosedRow: TprStandart
  collapsed: boolean
  year: number
  hasChanges: boolean
  openedPeriod: number[]
  canSave: boolean
}>()
const emit = defineEmits<{
  (e: 'update:collapsed', data: boolean): void
  (e: 'needSave'): void
}>()
const setChange = inject('setChange') as <
  K extends keyof TprStandart,
  T extends TprStandart[K]
>(change: {
  field: K
  value: T
}) => void

const connectionStatus = computed(() => (props.choosedRow.connection ? 'Связан' : 'Не связан'))
const stageStatus = computed(() => {
  if (props.choosedRow.connection) {
    if (
      +props.choosedRow.connection.connectedStageCount > 0 &&
      +props.choosedRow.connection.emptyStageCount === 0
    )
      return 'Полностью распределены'
    if (
      +props.choosedRow.connection.connectedStageCount > 0 &&
      +props.choosedRow.connection.emptyStageCount !== 0
    )
      return 'Частично распределены'
    if (
      +props.choosedRow.connection.connectedStageCount === 0 &&
      +props.choosedRow.connection.emptyStageCount === 0
    )
      return 'Нет этапов в текущем году'
  }
  return 'Не распределены'
})

const computedYear = computed(() => props.year)
const computedRow = computed(() => props.choosedRow)
const {
  getContractWithIndexes,
  toggleConnection,
  setContractInfo,
  copyName,
  getContractByContractNumber,
  copyPlanCp
} = useSudConnection(computedRow, computedYear)

async function copyAllHandler() {
  if (computedRow.value.connection) {
    getContractWithIndexes(computedRow.value.connection.contractId).then(({ data }) => {
      setContractInfo(data)
      notify('Данные скопированы')
    })
  }
}

async function copyNameHandler() {
  if (computedRow.value.connection) {
    getContractWithIndexes(computedRow.value.connection.contractId).then(({ data }) => {
      copyName(data)
      notify('Наименование скопировано')
    })
  }
}

function copyCpToPrognos() {
  const prefix = props.choosedRow.genwork_CalendarPlan ? 'general' : 'sub'
  const [start, finish] = props.openedPeriod
  for (let i = start + 1; i < finish + 1; i++) {
    setChange({
      field: `${prefix}_mounth${i}_price_Stage` as keyof TprStandart,
      value: props.choosedRow[`${prefix}_mounth${i}_planCp_None` as keyof TprStandart] as number
    })
  }
  notify(`План по КП за ${start + 1}-${finish} месяцы скопирован в прогноз`)
}

const contract = ref<Contract>()
function getContractForCard() {
  if (props.choosedRow.connection)
    return getContractWithIndexes(props.choosedRow.connection.contractId).then(({ data }) => {
      contract.value = data
    })
}

const isStageConnectorVisible = ref(false)
async function showStageConnector() {
  if (props.hasChanges && !props.canSave)
    return notify('Перед выполнением этой операции нужно исправить ошибки', 'danger')
  await getContractForCard()
  isStageConnectorVisible.value = true
}

async function toggleConnectionHandler() {
  if (props.hasChanges && !props.canSave)
    return notify('Перед выполнением этой операции нужно исправить ошибки', 'danger')
  if (props.hasChanges) {
    confirm('Внесенные изменения будут сохранены, продолжить?')
      .then(async () => {
        await toggleConnectionExecuter()
        emit('needSave')
      })
      .catch(() => {})
  } else {
    await toggleConnectionExecuter()
    emit('needSave')
  }
}
async function toggleConnectionExecuter() {
  if (props.choosedRow.connection) {
    await confirm('Удалить связь с договором?')
      .then(async () => {
        await toggleConnection()
        copyPlanCp()
        notify('Договор отвязан')
      })
      .catch(() => {})
  } else {
    const contracts = (await getContractByContractNumber(props.choosedRow.numberContract_None)).data
    if (contracts.length === 0) return notify('Договор не найден', 'danger')
    if (contracts.length === 1) {
      await toggleConnection(contracts[0])
      notify('Договор привязан')
    }
    if (contracts.length > 1) {
      await toggleConnection([...contracts].sort((a, b) => +a.price - +b.price)[0])
      notify('Договор привязан')
    }
  }
}
const isNumberContractInvalid = inject('isNumberContractInvalid') as Ref<boolean>
</script>
<style>
.button-row {
  padding-top: 10px;
}
.sud-connection {
  margin-top: 10px;
  padding: 0 5px 5px;
  background: var(--tnnc-color-gray-light);
}
</style>
