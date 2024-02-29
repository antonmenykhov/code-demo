<template>
  <div class="prod-prog">
    <TprTable
      :year="year"
      @editing-start="startEditingHandler"
      ref="table"
      :editable="canEditSupp && isNowOrFuture"
    >
      <template #default="{ getRows, addChangeRow, chooseRow, deleteRow, availableDepartments }">
        <YearChooser
          v-model:year="year"
          @update:year="
            () => {
              getRows()
              getOpenedPeriod()
            }
          "
        />
        <TprCard
          v-model:isCardShowed="isCardShowed"
          :editableCollection="editableCollection"
          :errors="errors"
          :year="year"
          :availableDepartments="availableDepartments"
          :openedPeriod="openedPeriod"
          @change-current-row="(tpr) => chooseRow(tpr.ID)"
          @save-tpr="
            (e) => addChangeRow(e.changes, e.isNew, e.rowWithChanges, e.needUpdateConnections)
          "
          @delete-row="deleteRow"
          :editable="canEditSupp && isNowOrFuture"
          @update:is-card-showed="flushQueryParams"
        ></TprCard>
      </template>
      <template #right="{ addChangeRow, availableDepartments }">
        <a class="tnnc-button" href="/new-front/Инструкция по новому ТПР и карточкам.docx" download>
          Инструкция
        </a>
        <TprCreationWizard
          :editable="canEditSupp && isNowOrFuture"
          :year="year"
          :available-departments="availableDepartments"
          @save-tpr="(tpr) => addChangeRow(tpr, true)"
        />
      </template>
      <template #right-hidden="{ months }">
        <SelectBox
          v-if="isAdmin || isEconomist"
          label="Закрыто по"
          :options="[{ id: 0, name: 'Начало года' }, ...months]"
          v-model:value="openedPeriod[0]"
          display-expr="name"
          value-expr="id"
          :options-width="200"
          @update:value="updateOpenedPeriod"
        />
      </template>
    </TprTable>
  </div>
</template>
<script lang="ts" setup>
import YearChooser from '@/components/general/YearChooser.vue'
import TprTable from '@/widgets/tpr-table/TprTable.vue'
import TprCard from '@/widgets/tpr-card/TprCard.vue'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { computed, onMounted, ref } from 'vue'
import type { TprError } from '@/interfaces/supp-entities/tpr-error.interface'
import TprCreationWizard from '@/widgets/tpr-wizard/TprCreationWizard.vue'
import { useRoute } from 'vue-router'
import { isNumber } from '@vueuse/core'
import useTprConnections from '@/widgets/tpr-table/composables/useTprConnections.composable'
import useTprClosePeriod from '@/widgets/tpr-table/composables/useTprClosePeriod.composable'
import { storeToRefs } from 'pinia'
import { useLockStore } from '@/store/lock.store'
import { SelectBox } from 'tnnc-ui-kit'
import useTprHttp from '@/composables/http/use-tpr-http.composable'

const { canEditSupp, isAdmin, isEconomist } = storeToRefs(useLockStore())
const { getOneConnection } = useTprConnections()
const { getTprErrors } = useTprHttp()
const year = ref(new Date().getFullYear())
async function startEditingHandler(e: {
  currentRow: TprStandart
  rowsWithSameMainNumber: TprStandart[]
  rowsWithSameContractId: TprStandart[]
}) {
  editableCollection.value = e
  getErrors(e.currentRow.ID)
  isCardShowed.value = true
  if (e.currentRow.connection) {
    const connection = (await getOneConnection(e.currentRow.connection.id)).data
    editableCollection.value.currentRow.connection = connection.contractId ? connection : undefined
  }
}
const isCardShowed = ref(false)
const editableCollection = ref<{
  currentRow: TprStandart
  rowsWithSameMainNumber: TprStandart[]
  rowsWithSameContractId: TprStandart[]
} | null>(null)

const errors = ref<TprError[]>([])
async function getErrors(tprID: number) {
  return getTprErrors(year.value, [tprID]).then(({ data }) => (errors.value = data))
}
const table = ref<InstanceType<typeof TprTable>>()
function openCard(id: number) {
  if (table.value) table.value.emitEditingStart(id)
}
const route = useRoute()
onMounted(() => {
  if (route.query.id && isNumber(+route.query.id)) openCard(+route.query.id)
})
const { getOpenedPeriod, openedPeriod, updateOpenedPeriod } = useTprClosePeriod(year)
getOpenedPeriod()

function flushQueryParams() {
  if (route.query) {
    window.history.pushState(
      { path: window.location.href.split('?')[0] },
      '',
      window.location.href.split('?')[0]
    )
  }
}

const isNowOrFuture = computed(() => year.value >= new Date().getFullYear())
</script>
<style lang="scss">
a.tnnc-button {
  text-decoration: none;
  color: black;
  font-size: 16px !important;
  font-weight: 400;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
