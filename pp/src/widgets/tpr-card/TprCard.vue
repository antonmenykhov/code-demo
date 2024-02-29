<template>
  <div class="tpr-card-wrapper" v-if="changedRow && editableCollection">
    <Teleport to="body">
      <div class="tpr-card" v-if="isCardShowed" :class="{ visible: isCardShowed }">
        <div class="tpr-card-content" ref="tprCard">
          <div class="row card-tool-bar">
            <div class="row">
              <ButtonComponent
                icon-class="fa-solid fa-rotate-left"
                @click="revertAction"
                :disabled="!hasChanges"
                v-title="'Отменить последнее действие'"
              />
              <DropDownButton
                text="Нар. итог"
                list-css-class="drop-down-big-list"
                v-title="`${months[growingRange[0] - 1]} - ${months[growingRange[1] - 1]}`"
              >
                <MonthRange text="Нар. итог" v-model:range="growingRange" without-loader />
              </DropDownButton>

              <SelectBox
                label="Силы"
                :options="forceTypes"
                v-model:value="choosedForceTypes"
                display-expr="caption"
                value-expr="name"
                button-mode
                :options-width="200"
              />
              <SelectBox
                label="Показатели"
                :options="indexTypes"
                v-model:value="choosedIndexTypes"
                display-expr="caption"
                value-expr="name"
                button-mode
                :options-width="200"
              />
              <SelectBox
                label="Месяцы/итоги"
                :options="monthsTotalsHandbook"
                v-model:value="choosedMonthsTotals"
                display-expr="name"
                value-expr="id"
                button-mode
                :options-width="200"
              />
              <a
                class="tnnc-button"
                href="/new-front/Инструкция по новому ТПР и карточкам.docx"
                download
              >
                Инструкция
              </a>
            </div>
            <div class="row buttons">
              <ButtonComponent
                v-if="errors.length"
                :text="`Есть ошибки! (${errors.length})`"
                type="danger"
                @click="showErrors"
                v-title="`Показать ошибки`"
              />
              <ButtonComponent
                text="Сохранить"
                type="success"
                :disabled="!canSave"
                @click="save"
                v-title="`Сохранить ТПР`"
              />
              <ButtonComponent
                text="Удалить"
                type="danger"
                v-title="deleteButtonState.reason"
                :disabled="!deleteButtonState.allow"
                @click="deleteRow"
              />
              <ButtonComponent
                text="Отмена"
                @click="closeCard"
                v-title="`Отменить изменения и закрыть карточку`"
              />
              <TprCreationWizard
                v-if="choosedRowComputed?.genwork_CalendarPlan"
                v-show="editable"
                :editable="editable"
                is-sub
                :gen-tpr="choosedRowComputed"
                :available-departments="availableDepartments"
                :year="year"
                @save-tpr="create"
              />
              <TprSubMigration
                v-else
                v-show="editable"
                :year="year"
                @selected="setParentIdAndSave"
                :available-departments="availableDepartments"
              />
              <SettingsManaging
                ref="settingsStore"
                resource="tprCard"
                @settings-loaded="restoreSettings"
              />
            </div>
          </div>
          <div class="row main-content">
            <div class="main-content">
              <ContractInfo :choosed-row="changedRow" v-model:collapsed="collapsed.contractInfo" />
              <IndexesBlock
                :choosed-row="changedRow"
                :choosed-force-types-objects="choosedForceTypesObjects"
                :choosed-index-types-objects="choosedIndexTypesObjects"
                :choosed-months-totals="choosedMonthsTotals"
                :growing-range="growingRange"
                :is-sub="isSub"
                :opened-period="openedPeriod"
                v-model:collapsed_general="collapsed.indexesGeneral"
                v-model:collapsed_own="collapsed.indexesOwn"
                v-model:collapsed_sub="collapsed.indexesSub"
              />
              <ProfitFacrors
                :choosed-row="changedRow"
                v-model:collapsed_general="collapsed.factorsGeneral"
                v-model:collapsed_own="collapsed.factorsOwn"
              />
              <ErrorsBlock
                v-if="errors.length > 0"
                ref="errorsBlock"
                :errors="errors"
                v-model:collapsed="collapsed.errorsBlock"
                @vibrate-element="vibrateElementByFieldName"
              />
            </div>

            <CollabsablePanel
              panel-name="Атрибуты / Связь с ИС СУД / Ошибки"
              v-model:collapsed="collapsed.rightSide"
              positon="right"
              css-class="right-side"
            >
              <MainAttributes
                :choosed-row="changedRow"
                v-model:collapsed="collapsed.mainAttributes"
              />

              <AdditionalAttributes
                :choosed-row="changedRow"
                v-model:collapsed="collapsed.additionalAttributes"
              />
              <SudConnection
                v-if="editable"
                :tprs="editableCollection.rowsWithSameContractId"
                :choosed-row="changedRow"
                :year="year"
                :has-changes="hasChanges"
                :opened-period="openedPeriod"
                @need-save="() => save(true)"
                :can-save="canSave"
                v-model:collapsed="collapsed.sudConnection"
              />
            </CollabsablePanel>
            <CollabsablePanel
              v-model:collapsed="collapsed.leftSide"
              panelName="Связанные ТПР"
              positon="right"
              css-class="left-side"
            >
              <ContractsTree
                :editable-collection="editableCollection"
                :choosedRow="changedRow"
                @element-clicked="changeCurrentRow"
              />
            </CollabsablePanel>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script lang="ts" setup>
import type { TprError } from '@/interfaces/supp-entities/tpr-error.interface'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { ButtonComponent, confirm, DropDownButton, SelectBox } from 'tnnc-ui-kit'
import { computed, provide, ref, watch } from 'vue'
import MonthRange from '@/components/general/MonthRange.vue'
import AdditionalAttributes from '@/components/tpr-card/AdditionalAttributes.vue'
import ContractInfo from '@/components/tpr-card/ContractInfo.vue'
import ContractsTree from '@/components/tpr-card/ContractsTree.vue'
import ErrorsBlock from '@/components/tpr-card/ErrorsBlock.vue'
import IndexesBlock from '@/components/tpr-card/IndexesBlock.vue'
import MainAttributes from '@/components/tpr-card/MainAttributes.vue'
import ProfitFacrors from '@/components/tpr-card/ProfitFacrors.vue'
import SudConnection from '@/components/tpr-card/SudConnection.vue'
import useCardState from './composables/useCardState.composable'
import CollabsablePanel from '@/components/tpr-card/CollabsablePanel.vue'
import useCardEditing from './composables/useCardEditing.composable'
import { months } from '@/hooks/months'
import useCardValidations from './composables/useCardValidations.composable'
import useCardDisabledFields from '../tpr-card/composables/useCardDisabledFields.composable'
import useCardAnimation from './composables/useCardAnimation.composable'
import useCardFieldStyling from './composables/useCardFieldStyling.composable'
import TprCreationWizard from '../tpr-wizard/TprCreationWizard.vue'
import TprSubMigration from '../tpr-wizard/TprSubMigration.vue'
import type { Department } from '@/interfaces/supp-entities/department.interface'
import SettingsManaging from '@/components/general/SettingsManaging.vue'

const tprCard = ref<HTMLElement | null>(null)
const { vibrateElement, vibrateElementByQuerySelector, vibrateElementByFieldName } =
  useCardAnimation(tprCard)
const props = defineProps<{
  editableCollection: {
    currentRow: TprStandart
    rowsWithSameMainNumber: TprStandart[]
    rowsWithSameContractId: TprStandart[]
  } | null
  isCardShowed: boolean
  errors: TprError[]
  year: number
  availableDepartments: Department[]
  openedPeriod: [number, number]
  editable: boolean
}>()
const emit = defineEmits<{
  (e: 'update:isCardShowed', data: boolean): void
  (e: 'changeCurrentRow', data: TprStandart): void
  (
    e: 'saveTpr',
    eventData: {
      rowWithChanges?: TprStandart
      changes: Partial<TprStandart>
      needUpdateConnections: boolean
      isNew?: boolean
    }
  ): void
  (e: 'deleteRow', data: TprStandart): void
}>()

const settingsStore = ref<InstanceType<typeof SettingsManaging>>()
const {
  collapsed,
  growingRange,
  forceTypes,
  choosedForceTypes,
  choosedIndexTypes,
  indexTypes,
  choosedForceTypesObjects,
  choosedIndexTypesObjects,
  monthsTotalsHandbook,
  choosedMonthsTotals,
  isNumberContractInvalid,
  restoreSettings
} = useCardState(settingsStore)

provide('isNumberContractInvalid', isNumberContractInvalid)

const choosedRowComputed = computed(() => props.editableCollection?.currentRow || null)
const isSub = computed(() => !choosedRowComputed.value?.genwork_CalendarPlan)
watch(choosedRowComputed, (newVal) => {
  if (newVal && isSub.value && !choosedForceTypes.value.includes('sub')) {
    choosedForceTypes.value.push('sub')
  }
  flushChanges()
})
function changeCurrentRow(tpr: TprStandart) {
  if (changes.value.length > 0) {
    confirm('Внесенные в ТПР изменения не будут сохранены. Продолжить?')
      .then(() => {
        flushChanges()
        emit('changeCurrentRow', tpr)
      })
      .catch(() => {})
  } else emit('changeCurrentRow', tpr)
}

const computedYear = computed(() => props.year)
const { setChange, changedRow, revertAction, changes, deleteButtonState, hasChanges } =
  useCardEditing(choosedRowComputed, vibrateElementByQuerySelector, computedYear, indexTypes)
provide('setChange', setChange)

function closePopup() {
  flushChanges()
  emit('update:isCardShowed', false)
}

function closeCard() {
  if (changes.value.length) {
    confirm('Несохраненные изменения будут утеряны. Продолжить?')
      .then(() => {
        closePopup()
      })
      .catch(() => {})
  } else {
    closePopup()
  }
}

function flushChanges() {
  changes.value = []
  manualHilightedFields.value.clear()
  hilightedErrors.value.clear()
}

function save(needUpdateConnections = false) {
  const obj: Partial<TprStandart> = {}
  changes.value.forEach((change) => {
    // @ts-ignore
    obj[change.field] = change.value
  })
  if (changedRow.value)
    emit('saveTpr', { rowWithChanges: changedRow.value, changes: obj, needUpdateConnections })
}

function create(tpr: Partial<TprStandart>) {
  emit('saveTpr', { changes: tpr, needUpdateConnections: false, isNew: true })
}

function setParentIdAndSave(id: number) {
  setChange({ field: 'parentId_CalendarPlan', value: id })
  save()
}

function deleteRow() {
  confirm('Удалить ТПР?')
    .then(() => {
      if (changedRow.value) emit('deleteRow', changedRow.value)
      flushChanges()
      closePopup()
    })
    .catch(() => {})
}

function showErrors() {
  collapsed.value.errorsBlock = false
  const errorBlock = document.getElementById('tpr-card-errors')
  if (errorBlock && tprCard.value) {
    tprCard.value.scrollTo({
      top: errorBlock.getBoundingClientRect().y,
      behavior: 'smooth'
    })
    vibrateElement(errorBlock)
  }
}

const { allValidationErrors, canSave } = useCardValidations(changedRow, hasChanges)
provide('allValidationErrors', allValidationErrors)

const propEditable = computed(() => props.editable)
const propYear = computed(() => props.year)
const { disabledKeys } = useCardDisabledFields(changedRow, propEditable, propYear)
provide('disabledKeys', disabledKeys)

const { fieldsClasses, manualHilightedFields } = useCardFieldStyling(changedRow)
provide('fieldsClasses', fieldsClasses)
provide('manualHilightedFields', manualHilightedFields)

const hilightedErrors = ref(new Set<number>())
provide('hilightedErrors', hilightedErrors)
</script>
<style lang="scss">
.tpr-card-content {
  height: 100%;
  width: 100%;
  overflow: auto;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 10px;
  }
  .flex {
    flex: 1 1 300px;
  }
  .standart-width {
    flex: 0 1 200px;
  }
  .text-area {
    margin-top: 7px;
  }
  .tnnc-input-labeled input {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding-left: 5px !important;
    margin-top: 4px;
    background: rgba(255, 255, 255, 0.534);
  }
  .tnnc-input-labeled input:read-only {
    background: transparent;
  }
  .tnnc-input-container-prefix {
    padding-right: 5px;
  }
}
.tpr-card {
  overflow: hidden;
  position: absolute;
  left: 0.5vw;
  top: 0.5vh;
  bottom: 0.5vh;
  right: 0.5vh;
  z-index: 999;
  background: white;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.1s;
  opacity: 0;
  transform: scale(0);
  &.visible {
    transform: scale(1);
    opacity: 1;
  }
  .main-content {
    align-items: stretch;
  }
  .left-side {
    width: 230px;
  }
  .right-side {
    width: 350px;
  }
}
.main-content {
  flex: 1;
  align-self: flex-start;
}
.side {
  align-self: flex-start;
  max-width: 350px;
}
.card-tool-bar,
.card-tool-bar .row {
  align-items: center !important;
}
.card-tool-bar {
  margin: 10px 0;
}

.tpr-card-collapsable-block {
  &.index-color-main {
    background: rgb(146, 208, 80) !important;
  }
  &.index-color-blue {
    background: rgb(237, 244, 252) !important;
  }
  &.index-color-red {
    background: rgb(242, 220, 219) !important;
  }
  &.index-color-orange {
    background: rgb(253, 233, 217) !important;
  }
  &.index-color-green {
    background: rgb(235, 241, 222) !important;
  }
  &.index-color-dark-blue {
    background: rgb(31, 73, 125) !important;
    color: white !important;
  }
  &.index-color-purple {
    background: rgb(255, 153, 255) !important;
  }
}

@keyframes vibrate {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-1px);
  }
  75% {
    transform: translateX(1px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes blink {
  50% {
    background: var(--tnnc-color-red);
  }
}
.tpr-card-green {
  input {
    background: rgb(211, 250, 211) !important;
  }
}

.tpr-card-red {
  .tnnc-text-area,
  input {
    background: rgb(250, 190, 190) !important;
  }
}
.tpr-manual-hilight {
  input {
    border-bottom: 2px solid var(--tnnc-color-red) !important;
  }
}
.drop-down-big-list {
  width: 300px !important;
}
</style>
