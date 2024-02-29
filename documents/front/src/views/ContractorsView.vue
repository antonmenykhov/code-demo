<template>
  <div class="contractors-view">
    <TableComponent
      :rows="mappedCollection"
      :columns="isMobile ? columns.slice(0, 1) : columns"
      :hide-action-buttons="!isInitier"
      :hide-add-button="!isInitier"
      table-name="contractors-table"
      @create="createHandler"
      @update="updateHandler"
      @delete="deleteHandler"
    />
    <ContractorCard
      :contractor="contractorForEditing"
      v-model:opened="cardOpened"
      :title="cardTitle"
      :loading="cardLoading"
      @save="saveContractorHandler"
    />
  </div>
</template>
<script lang="ts" setup>
import ContractorCard from '@/components/ContractorCard.vue'
import TableComponent, { type TableColumn } from '@/components/TableComponent.vue'
import useContractors from '@/composables/useContractors.composable'
import type { Contractor } from '@/interfaces/contractor.interface'
import { useModeStore } from '@/stores/modeStore'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { isMobile } = storeToRefs(useModeStore())
const { isInitier } = storeToRefs(useUserInfoStore())
const { saveHandler, collection, createNewContractorMock, getAll, deleteHandler } = useContractors()

const mappedCollection = computed(() =>
  collection.value.map((item) => ({
    ...item,
    managers: item.directors?.map((director) => director.name).join(', ') || ''
  }))
)

const columns: TableColumn[] = [
  {
    name: 'name',
    caption: 'Наименование организации'
  },
  {
    name: 'shortName',
    caption: 'Короткое наименование организации'
  },
  {
    name: 'managers',
    caption: 'Руководители'
  },
  {
    name: 'reqisits',
    caption: 'Реквизиты организации'
  },
  {
    name: 'address',
    caption: 'Адрес организации'
  },
  {
    name: 'email',
    caption: 'Адрес электронной почты'
  }
]
const contractorForEditing = ref<Contractor>(createNewContractorMock())
const cardOpened = ref(false)
const cardTitle = computed(() =>
  contractorForEditing.value?.id === 0 ? 'Добавление контрагента' : 'Редактирование контрагента'
)
const cardLoading = ref(false)
function createHandler() {
  contractorForEditing.value = createNewContractorMock()
  cardOpened.value = true
}

async function saveContractorHandler(changedContractor: Contractor) {
  contractorForEditing.value = await saveHandler(changedContractor, contractorForEditing.value)
}
function updateHandler(contractor: Contractor) {
  contractorForEditing.value = contractor
  cardOpened.value = true
}
getAll()
</script>
<style lang="scss">
.contractors-view {
  height: 100%;
  & > * {
    height: 100%;
  }
}
</style>
