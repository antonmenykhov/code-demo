<template>
  <div class="companys-view">
    <TableComponent
      :rows="collection"
      :columns="isMobile ? columns.slice(0, 1) : columns"
      :hide-action-buttons="!isInitier"
      :hide-add-button="!isInitier"
      table-name="companies-table"
      @create="createHandler"
      @update="updateHandler"
      @delete="deleteHandler"
    />
    <CompanyCard
      v-if="companyForEditing"
      :company="companyForEditing"
      v-model:opened="cardOpened"
      :title="cardTitle"
      :loading="cardLoading"
      :emails="emails"
      @save="saveHandler"
    />
  </div>
</template>
<script lang="ts" setup>
import CompanyCard from '@/components/CompanyCard.vue'
import TableComponent, { type TableColumn } from '@/components/TableComponent.vue'
import useDefaultCurd from '@/composables/useDefaultCrud.composable'
import type { Company, CompanyAdditionalSigner } from '@/interfaces/company.interface'
import type { Email } from '@/interfaces/email.interface'
import { useModeStore } from '@/stores/modeStore'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { message } from 'ant-design-vue'
import type { AxiosResponse } from 'axios'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { isMobile } = storeToRefs(useModeStore())
const { isInitier } = storeToRefs(useUserInfoStore())
const { collection, getAll, createAndInsert, updateAndReplace, removeAndSplice } = useDefaultCurd<
  Company,
  Partial<Company> & {
    id: undefined
    documents: undefined
    additionalSigners: undefined
    defaultEmailId: number | null
  }
>('company')

const { create, update, remove } = useDefaultCurd<
  CompanyAdditionalSigner,
  Omit<CompanyAdditionalSigner, 'id'>
>('company-additional-signer')

const { collection: emails, getAll: getAllEmails } = useDefaultCurd<Email>('email')
getAllEmails()
const columns: TableColumn[] = [
  {
    name: 'name',
    caption: 'Наименование организации'
  },
  {
    name: 'manager',
    caption: 'Должность, ФИО руководителя'
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
  },
  {
    name: 'email',
    caption: 'Адрес электронной почты'
  }
]
const companyForEditing = ref<Company | undefined>()
const cardOpened = ref(false)
const cardTitle = computed(() =>
  companyForEditing.value?.id === 0 ? 'Добавление компании' : 'Редактирование компании'
)
const cardLoading = ref(false)
function createHandler() {
  companyForEditing.value = {
    id: 0,
    name: '',
    address: '',
    reqisits: '',
    email: '',
    manager: '',
    documents: [],
    stampId: null,
    headerId: null,
    pathToDir: '',
    additionalSigners: [],
    defaultEmail: null,
    defaultEmailId: null
  }
  cardOpened.value = true
}
async function saveHandler(changedCompany: Company) {
  let newCompany: Company = JSON.parse(JSON.stringify(changedCompany))
  if (changedCompany.id === 0) {
    newCompany = await createAndInsert({
      ...changedCompany,
      id: undefined,
      documents: undefined,
      additionalSigners: undefined
    })
  }
  await manageSigners(changedCompany, newCompany.id, companyForEditing.value || newCompany)
  newCompany = await updateAndReplace(newCompany.id, {
    ...newCompany,
    id: undefined,
    documents: undefined,
    additionalSigners: undefined
  })

  companyForEditing.value = newCompany
  message.success('Компания сохранена')
}
function updateHandler(company: Company) {
  companyForEditing.value = company
  cardOpened.value = true
}
async function deleteHandler(id: number) {
  removeAndSplice(id).then(() => {
    message.success('Компания удалена')
  })
}
getAll()

async function manageSigners(
  changedCompany: Company,
  companyId: number,
  companyForEditing: Company
) {
  const promisesList: Promise<AxiosResponse>[] = []
  const signersForDelete = companyForEditing.additionalSigners.filter(
    (signer) => !changedCompany.additionalSigners.some((newSigner) => signer.id === newSigner.id)
  )
  const signersForCreate = changedCompany.additionalSigners.filter((signer) => signer.id === 0)
  const signersForUpdate = changedCompany.additionalSigners.filter((signer) => signer.id !== 0)

  promisesList.push(...signersForDelete.map((signer) => remove(signer.id)))
  promisesList.push(
    ...signersForUpdate.map((signer) =>
      update(signer.id, {
        companyId,
        name: signer.name,
        stampId: signer.stampId
      })
    )
  )
  promisesList.push(
    ...signersForCreate.map((signer) =>
      create({
        companyId,
        name: signer.name,
        stampId: signer.stampId
      })
    )
  )
  return Promise.all(promisesList)
}
</script>
<style lang="scss">
.companys-view {
  height: 100%;
  & > * {
    height: 100%;
  }
}
</style>
