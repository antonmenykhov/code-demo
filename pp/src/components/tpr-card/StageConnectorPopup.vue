<template>
  <PopupComponent
    title="К договору привязано более одного тем.плана, необходимо распределить этапы"
    width="98vw"
    height="98vh"
    :visible="visible"
    @update:visible="close"
  >
    <div class="editing-area">
      <DxScrollView class="scrollable-board" direction="horizontal" show-scrollbar="always">
        <DxSortable
          class="sortable-lists"
          item-orientation="horizontal"
          handle=".list-title"
          @reorder="onListReorder"
        >
          <div v-for="(group, index) in groups" :key="group.ID" class="list">
            <div :title="group.name_CalendarPlan" class="list-title dx-theme-text-color">
              <i
                v-if="group.name_CalendarPlan !== 'Нераспределенные этапы'"
                title="Подробнее"
                class="dx-icon-info info-icon"
                @click="showTPRInfo(group)"
              />
              {{ group.ID }}. {{ group.name_CalendarPlan }}
              <div
                v-if="
                  group.name_CalendarPlan !== 'Нераспределенные этапы' &&
                  group.genwork_CalendarPlan === false
                "
              >
                Генподряд: {{ group.subs?.[0]?.numberContract_None }}
              </div>
            </div>
            <DxScrollView class="scrollable-list" show-scrollbar="always">
              <DxSortable
                :data="group.stages"
                class="sortable-cards"
                group="tasksGroup"
                :element-attr="{
                  id: 'project-' + group.ID
                }"
                @drag-start="onTaskDragStart($event)"
                @reorder="onTaskDrop($event)"
                @add="onTaskDrop($event)"
              >
                <div
                  v-for="stage in group.stages"
                  :key="stage.id"
                  class="card dx-card dx-theme-text-color dx-theme-background-color"
                >
                  <div :title="stage.name" class="card-subject">
                    <i
                      @click="showStageInfo(stage)"
                      title="Подробнее"
                      class="dx-icon-info info-icon"
                    ></i>
                    {{ stage.contentsNumber }} {{ stage.name }}
                  </div>
                  <div class="total">
                    <div class="label">Дата окончания</div>
                    <div class="value">{{ useDateFormat(stage.finish, 'DD.MM.YYYY').value }}</div>
                  </div>
                  <div class="total">
                    <div class="label">Стоимость</div>
                    <div class="value">
                      <b>{{ getFormateValue(+stage.price) }}</b>
                    </div>
                  </div>
                </div>
              </DxSortable>
            </DxScrollView>
            <div class="group-totals">
              <div class="total" v-for="(month, monthIndex) in months" :key="month">
                <div class="label">{{ month }}:</div>
                <div class="value">
                  {{
                    getFormateValue(
                      totals[index][('contractIndex' + (monthIndex + 1)) as keyof ContractIndexes]
                    )
                  }}
                </div>
              </div>
            </div>
            <div class="total total-year">
              <div class="label">Всего за год:</div>
              <div class="value">{{ getFormateValue(totals[index].totalYear) }}</div>
            </div>
          </div>
        </DxSortable>
      </DxScrollView>

      <StageTPRInfoPopup
        :showInfo="showInfo"
        :stageInfo="stageInfo"
        :tprInfo="tprInfo"
        @close="closeInfoPopUp"
      />
    </div>
  </PopupComponent>
</template>

<script lang="ts" setup>
import StageTPRInfoPopup from './StageTPRInfoPopup.vue'
import { DxScrollView } from 'devextreme-vue/scroll-view'
import { DxSortable } from 'devextreme-vue/sortable'
import { PopupComponent, getFormateValue } from 'tnnc-ui-kit'
import type { Stage } from '@/interfaces/contracts-entities/stage.interface'
import { computed, ref, watch } from 'vue'
import { months } from '@/hooks/months'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import type { Contract } from '@/interfaces/contracts-entities/contract.interface'
import type { ContractIndexes } from '@/interfaces/contracts-entities/contract-indexes.interface'
import type { DragEndEvent, DragStartEvent, ReorderEvent } from 'devextreme/ui/sortable'
import { useDateFormat } from '@vueuse/core'
import useContractsStagesHttp from '@/composables/http/use-contracts-stages-http.composable'

export type StageConnectorTpr = Partial<TprStandart> & { stages?: Stage[] }

const props = defineProps<{
  visible: boolean
  contract: Contract
  tprs: TprStandart[]
  year: number
}>()

const emit = defineEmits<{
  (e: 'update:visible', data: boolean): void
}>()

const stages = ref<Stage[]>([])
const groups = ref<StageConnectorTpr[]>([])
const showInfo = ref(false)
const tprInfo = ref<StageConnectorTpr>()
const stageInfo = ref<Stage>()

function showStageInfo(stage: Stage) {
  stageInfo.value = stage
  showInfo.value = true
}
function showTPRInfo(tpr: StageConnectorTpr) {
  tprInfo.value = tpr
  showInfo.value = true
}
function closeInfoPopUp() {
  showInfo.value = false
  stageInfo.value = undefined
}

function getGroups() {
  groups.value = [{ ID: 0, name_CalendarPlan: 'Нераспределенные этапы' }, ...props.tprs].map(
    (group, index) => {
      if (index === 0) {
        return {
          ...group,
          stages: stages.value
            .filter((stage) => stage.suppProject === null)
            .sort((a, b) => {
              if (a.contentsNumber > b.contentsNumber) {
                return 1
              }
              if (a.contentsNumber < b.contentsNumber) {
                return -1
              }
              return 0
            })
        }
      } else {
        return {
          ...group,
          stages: stages.value
            .filter((stage) => {
              if (stage.suppProject) {
                return stage.suppProject.projectId === group.ID
              }
              return false
            })
            .sort((a, b) => {
              if (a.contentsNumber > b.contentsNumber) {
                return 1
              }
              if (a.contentsNumber < b.contentsNumber) {
                return -1
              }
              return 0
            })
        }
      }
    }
  )
}
function onListReorder(e: ReorderEvent) {
  const group = groups.value.splice(e.fromIndex, 1)[0]
  groups.value.splice(e.toIndex, 0, group)
}
function onTaskDragStart(e: DragStartEvent) {
  e.itemData = e.fromData[e.fromIndex]
}
function onTaskDrop(e: DragEndEvent) {
  e.fromData.splice(e.fromIndex, 1)
  e.toData.splice(e.toIndex, 0, e.itemData)
  setStageConnection(+e.element.id.split('-')[1], e.itemData.id)
}
const { getStagesByContractId: getStagesByContractIdHttp, createTprToContractStageConnection } =
  useContractsStagesHttp()
function setStageConnection(projectId: number, stageId: string) {
  createTprToContractStageConnection(projectId, stageId, props.year)
}
async function getStagesByContractId() {
  getStagesByContractIdHttp(props.contract.id).then(({ data }) => {
    stages.value = data
      .filter((stage) => new Date(stage.finish).getFullYear() === props.year)
      .sort((a, b) => +a.price - +b.price)
    getGroups()
  })
}
function close() {
  emit('update:visible', false)
}

getStagesByContractId()

watch(props, () => {
  getStagesByContractId()
})

const totals = computed(() => {
  return groups.value.map((group) => {
    const groupTotal: ContractIndexes = {
      year: 0,
      contractIndex1: 0,
      contractIndex2: 0,
      contractIndex3: 0,
      contractIndex4: 0,
      contractIndex5: 0,
      contractIndex6: 0,
      contractIndex7: 0,
      contractIndex8: 0,
      contractIndex9: 0,
      contractIndex10: 0,
      contractIndex11: 0,
      contractIndex12: 0,
      totalYear: 0
    }
    group.stages?.forEach((stage) => {
      const finishDate = new Date(stage.finish)
      const finishYear = finishDate.getFullYear()
      const finishMonth = finishDate.getMonth() + 1
      if (finishYear === props.year) {
        groupTotal[('contractIndex' + finishMonth) as keyof ContractIndexes] += +stage.price
        groupTotal.totalYear += +stage.price
      }
    })
    return groupTotal
  })
})
</script>
<style lang="scss">
.editing-area,
.container {
  height: 100%;
}
.editing-area {
  .dx-scrollview-content {
    min-height: 60vh;
  }
}
.list {
  border-radius: 8px;
  margin: 5px;
  background-color: rgba(192, 192, 192, 0.3);
  display: inline-block;
  vertical-align: top;
  white-space: normal;
}

.list-title {
  font-size: 16px;
  padding: 10px;
  padding-left: 30px;
  margin-bottom: -10px;
  font-weight: bold;
  cursor: pointer;
}

.scrollable-list {
  height: 400px;
  width: 260px;
  box-sizing: border-box;
}

.sortable-cards {
  min-height: 380px;
}

.card {
  position: relative;
  background-color: white;
  box-sizing: border-box;
  width: 230px;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
}

.card-subject {
  font-size: 14px;
  line-height: 1;
  padding-bottom: 10px;
}

.card-assignee {
  opacity: 0.6;
}

.dx-sortable {
  display: block;
}
.sortable-lists {
  display: flex;
  justify-content: center;
}
.list {
  height: 88vh;
  width: 350px;
  .group-totals {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 120px;
  }
  .total {
    display: flex;
    justify-content: space-between;
    margin: 0 10px;
    .label {
      font-size: 12px;
    }
    .value {
      font-size: 14px !important;
      margin-bottom: 3px !important;
    }
  }
  .total-year {
    font-size: 14px;
    font-weight: 500;
  }
}
.scrollable-list {
  width: calc(100% - 20px);
  height: 62vh !important;
  padding: 5px;
  background: rgba(255, 255, 255, 0.726);
  margin: 10px;
  border-radius: 5px;
}
.card {
  width: calc(100% - 20px);
}
.list-title {
  height: 90px;
  overflow: hidden;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 13px;
  line-height: 13px;
  font-weight: 500;
  color: black;
  padding: 10px;
}

.info-icon {
  color: #337ab7;
  margin-right: 5px;
  transition: all 0.3s;
  &:hover {
    color: orange;
  }
}
.card-subject {
  height: 44px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.card .total {
  margin: 0;
}

.sortable-cards {
  min-height: 60vh;
}
</style>
