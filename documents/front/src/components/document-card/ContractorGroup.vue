<template>
  <div class="contractor">
    <FormItem :label="labelContractor" :validate-status="fieldStatuses.contractorId">
      <Select
        ref="contractorsSelect"
        :disabled="disabled"
        v-model:value="contractorId"
        :options="contractorsHandbook"
        show-search
        optionFilterProp="label"
        :search-value="contractorSearchValue"
        @select="setDefaultDirector"
        @search="(value: string) => (contractorSearchValue = value)"
      >
        <template #notFoundContent>
          <p style="color: #333">Контрагент не найден</p>
          <Button v-if="isInitier" block @click="addNewContractorAndSet">
            Добавить в справочник
          </Button>
        </template>
      </Select>
    </FormItem>
    <FormItem
      v-if="showDirectorSelect && choosedContractor && choosedContractor.directors.length > 1"
      :label="labelDirector"
    >
      <Select
        :disabled="disabled"
        v-model:value="contractorDirectorId"
        :options="choosedContractor.directors"
        :field-names="{ label: 'name', value: 'id', options: 'children' }"
        show-search
        optionFilterProp="name"
      />
    </FormItem>
  </div>
</template>
<script lang="ts" setup>
import useContractors from '@/composables/useContractors.composable'
import type { ContractorDirector } from '@/interfaces/contractor-director.interface'
import type { Contractor } from '@/interfaces/contractor.interface'
import type { DocumentItem } from '@/interfaces/document-item.interface'
import { useHandbookStore } from '@/stores/handbookStore'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useVModels } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { FormItem, Select, Button } from 'ant-design-vue'

const props = defineProps<{
  contractor: Contractor | null | undefined
  contractorId: number | ''
  contractorDirector: ContractorDirector | null | undefined
  contractorDirectorId: number | ''
  disabled: boolean
  labelContractor: string
  labelDirector: string
  fieldStatuses: { [key in keyof Partial<DocumentItem>]: 'error' | '' }
  showDirectorSelect: boolean
}>()

const { contractors } = storeToRefs(useHandbookStore())
const emit = defineEmits<{
  (e: 'update:contractor', data: Contractor): void
  (e: 'update:contractorId', data: number | ''): void
  (e: 'update:contractorDirector', data: ContractorDirector): void
  (e: 'update:contractorDirectorId', data: number | ''): void
}>()
const { contractor, contractorDirector, contractorDirectorId, contractorId } = useVModels(
  props,
  emit
)

const contractorsHandbook = computed(() =>
  contractors.value.map((contractor) => ({ label: contractor.name, value: contractor.id }))
)
const choosedContractor = computed(() =>
  contractors.value.find((company) => company.id === props.contractorId)
)
function setDefaultDirector() {
  setTimeout(() => {
    contractor.value = choosedContractor.value || null
    contractorDirectorId.value = choosedContractor.value?.directors[0]?.id || ''
    contractorDirector.value =
      choosedContractor.value?.directors.find(
        (director) => director.id === contractorDirectorId.value
      ) || null
  })
}

const contractorSearchValue = ref('')
const { createNewContractorMock, saveHandler } = useContractors()
const contractorsSelect = ref()

async function addNewContractorAndSet() {
  const newContractor = await saveHandler(
    { ...createNewContractorMock(), name: contractorSearchValue.value },
    createNewContractorMock()
  )
  contractors.value.push(newContractor)
  contractorId.value = newContractor.id
  contractor.value = newContractor
  setDefaultDirector()
  if (contractorsSelect.value) contractorsSelect.value.blur()
}

const { isInitier } = storeToRefs(useUserInfoStore())
</script>
