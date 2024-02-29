import type { Delegation, CreateDelegationDto } from '@/interfaces/delegation.interface'
import useDefaultCurd from './useDefaultCrud.composable'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { storeToRefs } from 'pinia'
import useHttp from './useHttp.composable'
import { useHandbookStore } from '@/stores/handbookStore'
import type { DocumentItem } from '@/interfaces/document-item.interface'
import { message } from 'ant-design-vue'

export default function useDelegationWork() {
  const { myId } = storeToRefs(useUserInfoStore())
  const { users } = storeToRefs(useHandbookStore())
  const { create: createDelegation } = useDefaultCurd<Delegation, CreateDelegationDto>('delegation')
  const { http } = useHttp()

  function getTomorow() {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date
  }

  function initDelegation(
    data: { document: DocumentItem; delegationId?: number },
    toId: string = '',
    isNeedAprooving = false
  ) {
    return {
      id: 0,
      fromId: myId.value,
      toId: toId,
      documentId: data.document.id,
      description: '',
      date: JSON.parse(JSON.stringify(getTomorow())),
      document: null,
      from: null,
      to: null,
      parent: null,
      parentId: data.delegationId || null,
      childs: [],
      isReaded: false,
      updated: '',
      created: '',
      isAprooved: false,
      isNeedAprooving: isNeedAprooving,
      isActive: true,
      comments: []
    }
  }
  function createManagerDelegation(data: { document: DocumentItem; delegationId?: number }) {
    const manager = users.value.find((user) => user.clientRoles.documents.includes('Manager'))
    return initDelegation(data, manager?.id)
  }
  function createInitierDelegation(data: { document: DocumentItem; delegationId?: number }) {
    const initier = users.value.find((user) => user.clientRoles.documents.includes('Initier'))
    return initDelegation(data, initier?.id)
  }

  function createManagerAproovingDelegation(data: {
    document: DocumentItem
    delegationId?: number
  }) {
    const manager = data.document.delegations[data.document.delegations.length - 1].from
    return initDelegation(data, manager?.id, true)
  }

  async function saveDelegationHandler(delegation: Delegation) {
    return await createDelegation({
      date: delegation.date,
      description: delegation.description,
      toId: delegation.toId,
      fromId: delegation.fromId,
      documentId: delegation.documentId,
      isNeedAprooving: delegation.isNeedAprooving,
      parentId: delegation.parentId,
      isReaded: delegation.isReaded
    }).then(() => {
      message.success('Поручение создано')
    })
  }

  async function setReaded(delegations: Delegation[]) {
    const myDelegations = delegations.filter(
      (del) => del.toId === myId.value && del.isReaded === false
    )
    const promisesList: Promise<void>[] = []
    myDelegations.forEach((delegation) => {
      promisesList.push(http.post(`/delegation/readed/${delegation.id}`))
      delegation.isReaded = true
    })
    return Promise.all(promisesList)
  }

  async function setAprooved(data: { delegationId: number }) {
    return http.post(`/delegation/aprooved/${data.delegationId}`)
  }

  return {
    createDelegation,
    saveDelegationHandler,
    createManagerDelegation,
    createInitierDelegation,
    initDelegation,
    setReaded,
    createManagerAproovingDelegation,
    setAprooved
  }
}
