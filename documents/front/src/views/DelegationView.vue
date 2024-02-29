<template>
  <div class="companys-view">
    <TableComponent
      :class="{ isMobile }"
      :rows="delegationsMapped"
      :columns="columns"
      hide-action-buttons
      hide-add-button
      table-name="delegation-table"
      @click="openDelegationCard"
    >
      <template #toolbar-left>
        <Select
          class="toolbar-select"
          v-model:value="selectedFiltedValue"
          :options="filterValues"
        ></Select>
      </template>
    </TableComponent>
    <DocumentDelegationsCard
      ref="documentDelegationCard"
      @register-from-delegation="registerFromDelegationCard"
      @close="getAll"
    />
    <DocumentCard ref="documentCard" @registered="openDelegationCard" @close="getAll" />
  </div>
</template>
<script lang="ts" setup>
import DocumentCard from '@/components/DocumentCard.vue'
import DocumentDelegationsCard from '@/components/DocumentDelegationsCard.vue'
import TableComponent, { type TableColumn } from '@/components/TableComponent.vue'
import useDefaultCurd from '@/composables/useDefaultCrud.composable'
import type { Delegation } from '@/interfaces/delegation.interface'
import type { DocumentItem } from '@/interfaces/document-item.interface'
import { useModeStore } from '@/stores/modeStore'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useDateFormat } from '@vueuse/core'
import { Select } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { collection, getAll } = useDefaultCurd<Delegation>('delegation')
const { isMobile } = storeToRefs(useModeStore())
const { myId } = storeToRefs(useUserInfoStore())

const delegationsFormToReplaced = computed(() =>
  collection.value.map((item) => {
    if (item.description === 'Нужно утвердить')
      return { ...item, to: item.from, toId: item.fromId, from: item.to, fromId: item.toId }
    return item
  })
)
const filterValues = [
  {
    value: 1,
    label: 'Поручения мне'
  },
  {
    value: 2,
    label: 'Поручения от меня'
  },
  {
    value: 3,
    label: 'Все поручения'
  }
]
const selectedFiltedValue = ref(1)
const delegationsFiltered = computed(() => {
  if (selectedFiltedValue.value === 1)
    return delegationsFormToReplaced.value.filter((item) => item.toId === myId.value)
  if (selectedFiltedValue.value === 2)
    return delegationsFormToReplaced.value.filter((item) => item.fromId === myId.value)
  return delegationsFormToReplaced.value
})

const delegationsMapped = computed(() =>
  delegationsFiltered.value.map((del) => ({
    documentName: del.document?.name,
    regnumber: `${del.document?.regnumber} от ${
      useDateFormat(del.document?.created, 'DD.MM.YYYY').value
    }`,
    fioTo: del.to?.lastName,
    fioFrom: del.from?.lastName,
    status:
      del.isReaded === false
        ? 'Не прочитано'
        : del.isAprooved && del.isNeedAprooving
        ? 'Утверждено'
        : del.isActive === false
        ? 'Исполнено'
        : 'В работе',
    date: useDateFormat(del.updated, 'DD.MM.YYYY').value,
    document: del.document
  }))
)

const columns: TableColumn[] = [
  {
    name: 'fioTo',
    caption: 'Кому'
  },
  {
    name: 'fioFrom',
    caption: 'От кого'
  },
  {
    name: 'regnumber',
    caption: '№, дата документа'
  },
  {
    name: 'documentName',
    caption: 'Наименование документа'
  },
  {
    name: 'status',
    caption: 'Статус выполнения'
  },
  {
    name: 'date',
    caption: 'Дата статуса'
  }
]

getAll()

function isDelegation(item: any): item is Delegation {
  return 'document' in item
}
const documentDelegationCard = ref<InstanceType<typeof DocumentDelegationsCard>>()
function openDelegationCard(delegation: Delegation | DocumentItem) {
  const documentItem: DocumentItem | null = isDelegation(delegation)
    ? delegation.document
    : delegation
  if (documentDelegationCard.value && documentItem) {
    documentDelegationCard.value.openDocument(documentItem)
  }
}
const documentCard = ref<InstanceType<typeof DocumentCard>>()
async function registerFromDelegationCard(document: DocumentItem) {
  if (documentCard.value) {
    await documentCard.value.updateDocument(document)
    documentCard.value.registerDocumentHandler(true)
  }
}
</script>
<style lang="scss">
.companys-view {
  height: 100%;
  & > * {
    height: 100%;
  }
}
.isMobile {
  .ant-table-content {
    overflow: auto !important;
    display: block !important;
    width: 100% !important;
  }
}
.toolbar-select {
  width: 200px;
}
</style>
