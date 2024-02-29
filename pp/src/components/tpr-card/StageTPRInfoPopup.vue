<template>
  <PopupComponent
    :title="stageInfo ? 'Информация по этапу договора' : 'Информация по тем.плану'"
    width="60vw"
    height="60vh"
    :visible="showInfo"
    @update:visible="closeInfoPopUp"
  >
    <div class="editing-area">
      <div class="info" v-if="stageInfo">
        <div class="info-element">
          <div class="label">Название</div>
          <div class="value">{{ stageInfo.name }}</div>
        </div>
        <div class="info-element">
          <div class="label">Дата начала</div>
          <div class="value">{{ getDateFormated(stageInfo.start) }}</div>
        </div>
        <div class="info-element">
          <div class="label">Дата окончания</div>
          <div class="value">{{ getDateFormated(stageInfo.finish) }}</div>
        </div>
        <div class="info-element">
          <div class="label">Продолжительность раб.дней</div>
          <div class="value">{{ stageInfo.durationWD }}</div>
        </div>
        <div class="info-element">
          <div class="label">Продолжительность кален.дней</div>
          <div class="value">{{ stageInfo.durationCD }}</div>
        </div>
        <div class="info-element">
          <div class="label">Стоимость</div>
          <div class="value">{{ getFormateValue(+stageInfo.price) }}</div>
        </div>
      </div>
      <div class="info" v-else-if="tprInfo">
        <div class="info-element">
          <div class="label">Название</div>
          <div class="value">{{ tprInfo.name_CalendarPlan }}</div>
        </div>
        <div class="info-element">
          <div class="label">Дата начала</div>
          <div class="value">
            {{ getDateFormated(tprInfo.start_CalendarPlan || '') }}
          </div>
        </div>
        <div class="info-element">
          <div class="label">Дата окончания</div>
          <div class="value">
            {{ getDateFormated(tprInfo.finish_CalendarPlan || '') }}
          </div>
        </div>
        <div class="info-element">
          <div class="label">Контрагент</div>
          <div class="value">{{ tprInfo.customer_Staff_Project }}</div>
        </div>
        <div class="info-element" v-for="(month, index) in months" :key="month">
          <div class="label">БП / Прогноз {{ month }}</div>
          <div class="value">
            {{ getFormateValue(getPlan(index + 1)) }} /
            {{ getFormateValue(getPrice(index + 1)) }}
          </div>
        </div>
      </div>
    </div>
  </PopupComponent>
</template>

<script lang="ts" setup>
import { months } from '@/hooks/months'
import type { Stage } from '@/interfaces/contracts-entities/stage.interface'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { useDateFormat } from '@vueuse/core'
import { getFormateValue, PopupComponent } from 'tnnc-ui-kit'
import type { StageConnectorTpr } from './StageConnectorPopup.vue'

const props = defineProps<{
  stageInfo?: Stage
  tprInfo?: StageConnectorTpr
  showInfo: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function getPlan(index: number) {
  if (!props.tprInfo) return 0
  return props.tprInfo.genwork_CalendarPlan
    ? (props.tprInfo[`general_mounth${index}_plan_None` as keyof TprStandart] as number)
    : (props.tprInfo[`sub_mounth${index}_plan_None` as keyof TprStandart] as number)
}
function getPrice(index: number) {
  if (!props.tprInfo) return 0
  if (props.tprInfo.genwork_CalendarPlan) {
    return props.tprInfo[`general_mounth${index}_price_Stage` as keyof TprStandart] as number
  }
  return props.tprInfo[`sub_mounth${index}_price_Stage` as keyof TprStandart] as number
}
function closeInfoPopUp() {
  emit('close')
}

function getDateFormated(dateString: string) {
  return useDateFormat(dateString, 'DD.MM.YYYY').value
}
</script>

<style lang="scss">
.info-element {
  display: flex;
  border-bottom: 1px solid #ececec;
  .label {
    width: 220px;
    font-weight: 500;
  }
  .value {
    padding-left: 5px;
    flex: 1;
  }
}
</style>
