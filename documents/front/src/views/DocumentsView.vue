<template>
  <div class="in-documents-view">
    <Drawer v-model:open="filtersOpened" title="Фильтры" class="filter-panel">
      <h4>Год</h4>
      <Select
        v-model:value="selectedYear"
        :options="years"
        placeholder="Фильтр по году"
        :field-names="{ label: 'year', value: 'year', options: 'children' }"
        style="width: 100%"
        @select="getAllDocumentsAfterDelay"
      />
      <h4>Месяц</h4>
      <Select
        v-model:value="selectedMonths"
        :options="monthHandbook"
        placeholder="Фильтр по месяцу"
        :field-names="{ label: 'name', value: 'id', options: 'children' }"
        allow-clear
        style="width: 100%"
        mode="tags"
      />
      <h4>Контрагент</h4>
      <Select
        v-model:value="selectedContractorsIds"
        :options="contractorsHandbook"
        placeholder="Фильтр по контрагенту"
        :field-names="{ label: 'name', value: 'id', options: 'children' }"
        show-search
        allow-clear
        optionFilterProp="name"
        style="width: 100%"
        mode="tags"
      />
      <h4>Компания</h4>
      <Select
        v-model:value="selectedCompaniesIds"
        :options="companiesHandbook"
        placeholder="Фильтр по компании"
        :field-names="{ label: 'name', value: 'id', options: 'children' }"
        show-search
        allow-clear
        optionFilterProp="name"
        style="width: 100%"
        mode="tags"
      />
      <h4>Статус</h4>
      <Select
        v-model:value="selectedStates"
        :options="statusHandbook"
        placeholder="Фильтр по статусу"
        show-search
        allow-clear
        style="width: 100%"
        mode="tags"
      />
      <h4>Адресаты поручений</h4>
      <Select
        v-model:value="selectedUsers"
        :options="usersHandbook"
        placeholder="Фильтр по адресатам поручений"
        :field-names="{ label: 'lastName', value: 'id', options: 'children' }"
        optionFilterProp="lastName"
        show-search
        allow-clear
        style="width: 100%"
        mode="tags"
      />
    </Drawer>
    <TableComponent
      :class="{ isMobile }"
      :rows="filteredDocumentCollection"
      :columns="renderedColumns"
      :custom-cell-name="['status']"
      :hide-action-buttons="!isInitier && direction === 'in'"
      :hide-add-button="!isInitier && direction === 'in'"
      table-name="document-table"
      @create="createHandler"
      @update="updateHandler"
      @delete="deleteDocument"
      @click="openDocumentDelegationCard"
    >
      <template #toolbar-left>
        <Badge :dot="hasFilter">
          <Button @click="() => (filtersOpened = true)">Фильтры</Button>
        </Badge>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <StatusCellContent :record="record as DocumentReport"
        /></template>
      </template>
    </TableComponent>
    <DocumentCard
      ref="documentCard"
      @close="getAllDocumentsAfterDelay"
      @registered="openDocumentDelegationCard"
    />

    <DocumentDelegationsCard
      ref="delegationCard"
      @close="getAllDocumentsAfterDelay"
      @registerFromDelegation="registerFromDelegationCard"
    />
  </div>
</template>
<script lang="ts" setup>
import DocumentCard from '@/components/DocumentCard.vue'
import DocumentDelegationsCard from '@/components/DocumentDelegationsCard.vue'
import StatusCellContent from '@/components/StatusCellContent.vue'
import TableComponent, { type TableColumn } from '@/components/TableComponent.vue'
import useDefaultCurd from '@/composables/useDefaultCrud.composable'
import useDocumentWork from '@/composables/useDocumentWork.composable'
import type { Company } from '@/interfaces/company.interface'
import type { Contractor } from '@/interfaces/contractor.interface'
import type { DocumentItem, DocumentReport } from '@/interfaces/document-item.interface'
import type { User, UserInfo } from '@/interfaces/user.interface'
import { useHandbookStore } from '@/stores/handbookStore'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Badge, Button, Drawer, Select } from 'ant-design-vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useModeStore } from '@/stores/modeStore'
import type { Email } from '@/interfaces/email.interface'

const route = useRoute()
const { getDocs } = useNotificationStore()
const { isMobile } = storeToRefs(useModeStore())
const direction = ref<'in' | 'out'>(route.params.direction === 'in' ? 'in' : 'out')

const { isInitier } = storeToRefs(useUserInfoStore())

const filtersOpened = ref(false)
const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]
const monthHandbook = computed(() =>
  Array.from(
    new Set(documentsCollection.value.map((document) => +document.createdFormated.split('.')[1]))
  ).map((monthIndex) => ({ id: monthIndex, name: months[monthIndex - 1] }))
)
const companiesHandbook = computed(() =>
  companies.value.filter((company) =>
    documentsCollection.value.some((document) => company.name === document.companyName)
  )
)
const contractorsHandbook = computed(() =>
  contractors.value.filter((contractor) =>
    documentsCollection.value.some((document) => contractor.name === document.contractorName)
  )
)
const statusHandbook = computed(() =>
  Array.from(
    new Set<string>(
      documentsCollection.value.reduce<string[]>((acc, doc) => {
        return [...acc, ...doc.states]
      }, [])
    )
  ).map((state) => ({
    value: state,
    label: state
  }))
)
const usersHandbook = computed(() =>
  users.value.filter((user) =>
    documentsCollection.value.some((document) =>
      document.delegations.some(
        (delegation) =>
          (delegation.description === 'Нужно утвердить' ? delegation.fromId : delegation.toId) ===
          user.id
      )
    )
  )
)
const selectedCompaniesIds = ref<number[]>([])
const selectedContractorsIds = ref<number[]>([])
const selectedYear = ref<number>(new Date().getFullYear())
const selectedMonths = ref<number[]>([])
const selectedStates = ref<string[]>([])
const selectedUsers = ref<string[]>([])
const hasFilter = computed(
  () =>
    selectedCompaniesIds.value.length > 0 ||
    selectedContractorsIds.value.length > 0 ||
    selectedMonths.value.length > 0 ||
    selectedStates.value.length > 0 ||
    selectedUsers.value.length > 0
)
const filteredDocumentCollection = computed(() =>
  documentsCollection.value.filter((document) => {
    if (
      selectedMonths.value.length &&
      !selectedMonths.value.includes(+document.createdFormated.split('.')[1])
    )
      return false
    if (
      selectedCompaniesIds.value.length &&
      !selectedCompaniesIds.value.includes(document.company?.id || 0)
    )
      return false
    if (
      selectedContractorsIds.value.length &&
      !selectedContractorsIds.value.includes(document.contractor?.id || 0)
    )
      return false
    if (
      selectedStates.value.length &&
      !document.states.some((state) => selectedStates.value.includes(state))
    )
      return false
    if (
      selectedUsers.value.length &&
      !document.delegations.some((delegation) =>
        selectedUsers.value.includes(
          delegation.description === 'Нужно утвердить' ? delegation.fromId : delegation.toId
        )
      )
    )
      return false
    return true
  })
)

const { getAllDocuments, documentsCollection, deleteDocument } = useDocumentWork()
const { getAll: getCompanies } = useDefaultCurd<Company>('company')
const { getAll: getContractors } = useDefaultCurd<Contractor>('contractor')
const { getAll: getUsers } = useDefaultCurd<User>('user')
const { getAll: getYears } = useDefaultCurd<{ year: number; id: number }>('document/years')
const { getAll: getAllEmails } = useDefaultCurd<Email>('email')
const { getAll: getAllUserInfo } = useDefaultCurd<UserInfo>('user-info')

function getTimeFromForamtedValue(formatedValue: string) {
  if (!formatedValue.includes('.')) return 0
  return new Date(formatedValue.split('.').reverse().join('.')).getTime()
}

const columns: TableColumn[] = [
  {
    name: 'reportName',
    caption: 'Наименование',
    customSorter: (a: DocumentReport, b: DocumentReport) => {
      return +a.regnumber - +b.regnumber
    }
  },
  {
    name: 'dateTo',
    caption: 'Срок до',
    customSorter: (a: DocumentReport, b: DocumentReport) => {
      return getTimeFromForamtedValue(a.dateTo) - getTimeFromForamtedValue(b.dateTo)
    }
  },
  {
    name: 'status',
    caption: 'Статус',
    disableSort: true
  },
  {
    name: 'contractorName',
    caption: 'Контрагент'
  },
  {
    name: 'companyName',
    caption: 'Компания'
  },
  {
    name: 'createdFormated',
    caption: 'Дата создания',
    customSorter: (a: DocumentReport, b: DocumentReport) => {
      return new Date(a.created).getTime() - new Date(b.created).getTime()
    }
  }
]
const renderedColumns = computed(() => (isMobile.value ? [columns[0]] : columns))
const { users, companies, contractors, years, emails, userInfo } = storeToRefs(useHandbookStore())
getCompanies().then((data) => (companies.value = data))
getContractors().then((data) => (contractors.value = data))
getUsers().then((data) => (users.value = data.sort((a, b) => a.lastName.localeCompare(b.lastName))))
getAllEmails().then((data) => (emails.value = data))
getAllUserInfo().then((data) => (userInfo.value = data))
await getYears().then((data) => {
  years.value = data
  selectedYear.value = data[data.length - 1]?.year || new Date().getFullYear()
})
getAllDocumentsAfterDelay()

const documentCard = ref<InstanceType<typeof DocumentCard>>()
function createHandler() {
  if (documentCard.value) documentCard.value.createDocument(direction.value)
}
function updateHandler(value: DocumentReport) {
  if (documentCard.value) documentCard.value.updateDocument(value)
}
const delegationCard = ref<InstanceType<typeof DocumentDelegationsCard>>()
function openDocumentDelegationCard(value: DocumentReport | DocumentItem) {
  if (delegationCard.value) delegationCard.value.openDocument(value)
}

function getAllDocumentsAfterDelay() {
  getAllDocuments(direction.value, selectedYear.value)
  getDocs()
}
async function registerFromDelegationCard(document: DocumentItem) {
  if (documentCard.value) {
    await documentCard.value.updateDocument(document)
    documentCard.value.registerDocumentHandler(true)
  }
}
let interval = 0
onMounted(() => {
  interval = setInterval(getAllDocumentsAfterDelay, 60 * 1000)
})
onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>
<style lang="scss">
.delegation-state {
  &.red {
    color: red;
  }
}
.filter-panel {
  h4 {
    margin-bottom: 5px;
    color: #333;
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>
