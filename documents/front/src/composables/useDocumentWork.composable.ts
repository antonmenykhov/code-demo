import type {
  DocumentReport,
  DocumentItem,
  DocumentAdditionalContractorDto
} from '@/interfaces/document-item.interface'
import useDefaultCurd from './useDefaultCrud.composable'
import { ref } from 'vue'
import useHttp from './useHttp.composable'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useHandbookStore } from '@/stores/handbookStore'
import useDelegationState from './useDelegationState.composable'
import type { Attachment } from '@/interfaces/attachment.interface'
import { useUserInfoStore } from '@/stores/userInfoStore'
import type { CompanyAdditionalSigner } from '@/interfaces/company.interface'
import { useDateFormat } from '@vueuse/core'

export default function useDocumentWork() {
  const { http } = useHttp()
  const documentsCollection = ref<DocumentReport[]>([])
  const { getDocumentStates } = useDelegationState()
  async function getAllDocuments(direction: 'in' | 'out', year: number) {
    http.get<DocumentReport[]>(`/document/report/${direction}/${year}`).then(({ data }) => {
      documentsCollection.value = data
        .map((documentReport) => {
          documentReport.states = getDocumentStates(documentReport)
          return documentReport
        })
        .reduce<DocumentReport[]>((acc, documentReport, index, array) => {
          if (documentReport.groupLeaderId === null) {
            documentReport.group = [
              { ...documentReport, name: 'Исходный' },
              ...array
                .filter((doc) => doc.groupLeaderId === documentReport.id)
                .map((doc) => ({
                  ...doc,
                  name: `Обработка от ${useDateFormat(doc.created, 'DD.MM.YYYY').value}`
                }))
            ]
            documentReport.group.slice(1).forEach((doc) => {
              if ('states' in doc) documentReport.states.push(...doc.states)
            })
            acc.push(documentReport)
          }
          return acc
        }, [])
      return documentsCollection.value
    })
  }

  const {
    getOne: getOneDocument,
    create,
    remove,
    update
  } = useDefaultCurd<
    DocumentItem,
    {
      name: string
      regnumber: number
      content: string
      created: string
      isIncoming: boolean
      contractorId: number
      companyId: number
      attachmentId: number | null
      parentId: number | undefined
      contractorDirectorId: number | null
      externalCreated: null | string
      externalRegnumber: null | string
      recieptId: null | number
      isExternalRegistered: boolean
      additionalContractors: DocumentAdditionalContractorDto[]
      additionalAttachments: Attachment[]
      withWorkerMark: boolean
      workerId: string | null
      companyEmailToWorkerMark: boolean
      additionalSigners: CompanyAdditionalSigner[]
    }
  >('document')
  const { contractors } = storeToRefs(useHandbookStore())
  const { myId } = storeToRefs(useUserInfoStore())
  function getNewDocumentMock(
    isIncoming: boolean,
    parentId?: number | undefined,
    contractorId: '' | number = '',
    companyId: '' | number = '',
    attachments: Attachment[] = []
  ): DocumentItem {
    const contractor = contractors.value.find((con) => con.id === contractorId)
    return {
      id: 0,
      name: '',
      regnumber: 0,
      content: '',
      created: JSON.parse(JSON.stringify(new Date())),
      isIncoming: isIncoming,
      contractor: null,
      contractorId: contractorId,
      contractorDirector: null,
      contractorDirectorId: contractor?.directors[0]?.id || '',
      company: null,
      companyId: companyId,
      attachment: null,
      attachmentId: null,
      delegations: [],
      parentId: parentId,
      isRegistered: false,
      externalCreated: '',
      externalRegnumber: '',
      reciept: null,
      recieptId: '',
      isExternalRegistered: false,
      readingMarks: [],
      additionalContractors: [],
      additionalAttachments: attachments,
      withWorkerMark: true,
      workerId: myId.value,
      companyEmailToWorkerMark: false,
      additionalSigners: [],
      groupLeaderId: null
    }
  }
  async function saveDocument(changedDocument: DocumentItem) {
    changedDocument.additionalContractors = changedDocument.additionalContractors.filter(
      (contractor) => Number(contractor.contractorId) > 0
    )
    if (changedDocument.id === 0) {
      return (
        await create({
          name: changedDocument.name,
          regnumber: changedDocument.regnumber,
          content: changedDocument.content,
          created: changedDocument.created,
          isIncoming: changedDocument.isIncoming,
          contractorId: changedDocument.contractorId || 0,
          companyId: changedDocument.companyId || 0,
          attachmentId: changedDocument.attachmentId || null,
          parentId: changedDocument.parentId,
          contractorDirectorId: changedDocument.contractorDirectorId || null,
          recieptId: changedDocument.recieptId || null,
          externalCreated: changedDocument.externalCreated || null,
          externalRegnumber: changedDocument.externalRegnumber || null,
          isExternalRegistered: changedDocument.isExternalRegistered || false,
          additionalContractors: changedDocument.additionalContractors.map((contractor) => ({
            contractorDirectorId: contractor.contractorDirectorId,
            contractorId: contractor.contractorId,
            documentId: contractor.documentId
          })),
          additionalAttachments: changedDocument.additionalAttachments,
          withWorkerMark: changedDocument.withWorkerMark,
          workerId: changedDocument.workerId,
          companyEmailToWorkerMark: changedDocument.companyEmailToWorkerMark,
          additionalSigners: changedDocument.additionalSigners
        })
      ).data
    } else {
      await update(changedDocument.id, {
        name: changedDocument.name,
        regnumber: changedDocument.regnumber,
        content: changedDocument.content,
        created: changedDocument.created,
        isIncoming: changedDocument.isIncoming,
        contractorId: changedDocument.contractorId || 0,
        companyId: changedDocument.companyId || 0,
        attachmentId: changedDocument.attachmentId,
        parentId: changedDocument.parentId,
        contractorDirectorId: changedDocument.contractorDirectorId || null,
        recieptId: changedDocument.recieptId || null,
        externalCreated: changedDocument.externalCreated || null,
        externalRegnumber: changedDocument.externalRegnumber || null,
        isExternalRegistered: changedDocument.isExternalRegistered || false,
        additionalContractors: changedDocument.additionalContractors.map((contractor) => ({
          contractorDirectorId: contractor.contractorDirectorId,
          contractorId: contractor.contractorId,
          documentId: contractor.documentId
        })),
        additionalAttachments: changedDocument.additionalAttachments,
        withWorkerMark: changedDocument.withWorkerMark,
        workerId: changedDocument.workerId,
        companyEmailToWorkerMark: changedDocument.companyEmailToWorkerMark,
        additionalSigners: changedDocument.additionalSigners
      })
      return changedDocument
    }
  }

  async function deleteDocument(id: number) {
    return remove(id).then(() => {
      documentsCollection.value.splice(
        documentsCollection.value.findIndex((elem) => elem.id === id),
        1
      )
      message.success('Документ удален')
    })
  }

  async function stampDocument(data: { document: DocumentItem }) {
    return await http.post(`/document/stamp/${data.document.id}`)
  }
  async function toggleDocumentCompleted(documentId: number) {
    return await http.post('/document/toggle-completed/' + documentId)
  }
  async function setDocumentReaded(data: { document: DocumentItem }) {
    return await http.post(`/document/set-readed/${data.document.id}`)
  }
  async function setDocumentWithoutAnswer(data: { document: DocumentItem }) {
    return await http.post(`/document/set-without-answer/${data.document.id}`)
  }
  async function registerDocument(data: { document: DocumentItem }) {
    return http.post<{ id: number; regnumber: number; isRegistered: boolean }>(
      `/document/register/${data.document.id}`
    )
  }
  async function addExternalRegNumber(data: { document: DocumentItem }) {
    return await http.post(`/document/external-regnumber/${data.document.id}`)
  }

  async function createDocumentCopy(id: number) {
    return await http.post<DocumentItem>(`/document/copy/${id}`)
  }

  const documentDelegationsCardOpened = ref(false)
  return {
    deleteDocument,
    saveDocument,
    getNewDocumentMock,
    getAllDocuments,
    documentsCollection,
    stampDocument,
    documentDelegationsCardOpened,
    toggleDocumentCompleted,
    setDocumentReaded,
    registerDocument,
    getOneDocument,
    addExternalRegNumber,
    setDocumentWithoutAnswer,
    createDocumentCopy
  }
}
