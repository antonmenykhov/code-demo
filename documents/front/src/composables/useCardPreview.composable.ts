import type { DocumentItem } from '@/interfaces/document-item.interface'
import { ref, watch, type Ref, computed } from 'vue'
import useHttp from './useHttp.composable'
import { useDateFormat, useDebounceFn } from '@vueuse/core'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { storeToRefs } from 'pinia'
import type { Attachment } from '@/interfaces/attachment.interface'
import { useHandbookStore } from '@/stores/handbookStore'
import { base_url } from '@/config/urls'
import printJS from 'print-js'
import { message } from 'ant-design-vue'
import type { CompanyAdditionalSigner } from '@/interfaces/company.interface'

export type OutDocumentDto = {
  header_url: string
  regnumber: string
  date: string
  contractors: {
    contractor_director_staffName: string
    contractor_name: string
    contractor_address: string
    contractor_director_fullName: string
    contractor_email: string
  }[]
  answer_header: string
  answer_content: string
  withRegnumber: boolean
  company_manager: string
  withStamp: boolean
  company_stampId: string
  additional_attachments: Attachment[]
  with_worker: boolean
  worker_name: string
  worker_phone: string
  worker_email: string
  additionalSigners: CompanyAdditionalSigner[]
}

export default function useCardPreview(
  editableDocument: Ref<DocumentItem>,
  tabSelected?: Ref<number>
) {
  const previewContent = ref<string>('')
  const { token } = storeToRefs(useUserInfoStore())
  const { http } = useHttp()
  const { companies, contractors, users, userInfo } = storeToRefs(useHandbookStore())

  async function printWithoutSign() {
    const hide = message.loading('Подготовка файла для печати', 0)
    const attachment = await getContent(
      editableDocument.value,
      editableDocument.value.isStamped,
      editableDocument.value.isRegistered,
      true
    )
    if (attachment) {
      const url = `${base_url}/attachment/${attachment.id}?token=Bearer ${token.value}`
      printJS(url)
      hide()
    }
  }

  async function getContent(
    document: DocumentItem,
    withStamp = false,
    withRegnumber = false,
    hideStamp = false
  ) {
    if (document.isIncoming) return
    const company = companies.value.find((company) => company.id === document.companyId)
    const worker = users.value.find((user) => user.id === document.workerId)
    const userInfoItem = userInfo.value.find((item) => item.userId === worker?.id)
    const dto: OutDocumentDto = {
      contractors: [
        getContractor(+document.contractorId, +document.contractorDirectorId),
        ...document.additionalContractors.map((contractor) =>
          getContractor(+contractor.contractorId, +contractor.contractorDirectorId)
        )
      ],
      header_url: company
        ? `${base_url}/attachment/${company?.headerId}?token=Bearer ${token.value}`
        : '',
      regnumber: `Исх. № ${document.regnumber}`,
      date: `от ${useDateFormat(document.created, 'DD.MM.YYYY').value} г.`,
      answer_header: document.name,
      answer_content: document.content.split('{{').join('{').split('}}').join('}'),
      withRegnumber,
      company_manager: (company?.manager || 'Компания не выбрана').split('\n').join(' <br> '),
      company_stampId: hideStamp ? '' : `${company?.stampId}`,
      withStamp,
      additional_attachments: document.additionalAttachments,
      with_worker: document.withWorkerMark,
      worker_email: document.companyEmailToWorkerMark
        ? company?.email || ''
        : userInfoItem?.email || worker?.email || '',
      worker_name: worker?.lastName || '',
      worker_phone: worker?.username || '',
      additionalSigners: document.additionalSigners
    }

    return http.post<Attachment>('/outdocument-attachment', dto).then(({ data }) => {
      if (!hideStamp) {
        editableDocument.value.attachment = data
        editableDocument.value.attachmentId = data.id
      }
      return data
    })
  }

  async function getContentAndUpload(
    document: DocumentItem,
    withStamp = false,
    withRegnumber = false
  ) {
    if (!document.isIncoming) {
      document.attachmentId = null
      await getContent(document, withStamp, withRegnumber)
      if (tabSelected?.value && tabSelected.value !== 3) tabSelected.value = 1
    }
  }

  function getContractor(contractorId: number, contractorDirectorId: number) {
    const contractor = contractors.value.find((contractor) => contractor.id === contractorId)
    const contractorDirector = contractor?.directors.find(
      (director) => director.id === contractorDirectorId
    )
    return {
      contractor_name:
        (contractor?.name || '').startsWith('ИП') ||
        (contractorDirector?.formFullName && !contractorDirector?.formStaffName)
          ? ''
          : contractor?.name || '',
      contractor_address: contractor?.address || '',
      contractor_director_fullName: contractorDirector?.formFullName || '',
      contractor_director_staffName: contractorDirector?.formStaffName || '',
      contractor_email: contractor?.email || ''
    }
  }

  const getContentThrotled = useDebounceFn(getContentAndUpload, 700)

  const watchedFields = computed(() => {
    const {
      content,
      companyId,
      contractorId,
      contractorDirectorId,
      id,
      name,
      additionalContractors,
      additionalAttachments,
      withWorkerMark,
      workerId,
      companyEmailToWorkerMark,
      additionalSigners
    } = editableDocument.value
    return {
      content,
      companyId,
      contractorId,
      contractorDirectorId,
      id,
      name,
      additionalContractors: additionalContractors.reduce((acc, contractor) => {
        return (acc += +contractor.contractorId + +contractor.contractorDirectorId)
      }, 0),
      additionalAttachments: additionalAttachments.reduce((acc, attachment) => {
        return (acc += attachment.id)
      }, 0),
      workerId,
      withWorkerMark,
      companyEmailToWorkerMark,
      additionalSigners: additionalSigners.reduce((acc, signer) => {
        return (acc += signer.id)
      }, 0)
    }
  })

  watch(watchedFields, (newVal, oldValue) => {
    if (
      newVal.id === oldValue.id &&
      (newVal.content !== oldValue.content ||
        newVal.companyId !== oldValue.companyId ||
        newVal.contractorId !== oldValue.contractorId ||
        newVal.name !== oldValue.name ||
        newVal.contractorDirectorId !== oldValue.contractorDirectorId ||
        newVal.additionalContractors !== oldValue.additionalContractors ||
        newVal.additionalAttachments !== oldValue.additionalAttachments ||
        newVal.withWorkerMark !== oldValue.withWorkerMark ||
        newVal.workerId !== oldValue.workerId ||
        newVal.companyEmailToWorkerMark !== oldValue.companyEmailToWorkerMark ||
        newVal.additionalSigners !== oldValue.additionalSigners)
    )
      getContentThrotled(
        editableDocument.value,
        editableDocument.value.isStamped,
        editableDocument.value.isRegistered
      )
  })

  return { previewContent, getContent, printWithoutSign }
}
