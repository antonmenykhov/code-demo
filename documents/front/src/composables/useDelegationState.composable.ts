import type { DocumentReport } from '@/interfaces/document-item.interface'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { storeToRefs } from 'pinia'

export default function useDelegationState() {
  const { myId } = storeToRefs(useUserInfoStore())
  function isLastDelegationUnreaded(record: DocumentReport) {
    const myDelegations = record.delegations.filter((del) => del.toId === myId.value)
    if (myDelegations.some((del) => del.isReaded === false)) return true
    return false
  }
  function isRedLine(record: DocumentReport) {
    const myDelegations = record.delegations.filter((del) => del.toId === myId.value)
    if (
      myDelegations.some((del) => {
        const dateTo = new Date(del.date).getTime()
        const now = new Date().getTime()
        return (
          dateTo - now > 0 &&
          dateTo - now < 1000 * 60 * 60 * 24 &&
          del.isActive &&
          !del.isNeedAprooving
        )
      })
    )
      return true

    return false
  }
  function isDeadLine(record: DocumentReport) {
    const myDelegations = record.delegations.filter((del) => del.toId === myId.value)
    if (
      myDelegations.some((del) => {
        const dateTo = new Date(del.date).getTime()
        const now = new Date().getTime()
        return dateTo - now <= 0 && del.isActive && !del.isNeedAprooving
      })
    )
      return true

    return false
  }

  function isNeedAprooving(record: DocumentReport) {
    if (
      record.delegations.filter(
        (delegation) =>
          delegation.isNeedAprooving && delegation.fromId === myId.value && !delegation.isAprooved
      ).length
    )
      return true
    return false
  }

  function isOnAprooving(record: DocumentReport) {
    if (record.delegations.some((del) => del.isNeedAprooving && !del.isAprooved)) return true
    return false
  }

  function isInWork(record: DocumentReport) {
    return record.delegations.length > 0 && !record.isCompleted
  }

  function isNotWorked(record: DocumentReport) {
    return !record.isCompleted && record.delegations.length === 0 && !record.parentId
  }

  function getDocumentStates(documentReport: DocumentReport): string[] {
    const states: string[] = []
    if (isInWork(documentReport)) states.push('В работе')
    if (documentReport.isCompleted) states.push('Исполнено')
    if (documentReport.isStamped) states.push('Подписано')
    if (isDeadLine(documentReport)) states.push('Срок исполнения истек')
    if (isRedLine(documentReport)) states.push('Истекает срок исполнения')
    if (isNeedAprooving(documentReport)) states.push('Нужно согласование')
    if (isLastDelegationUnreaded(documentReport)) states.push('Не прочитано')
    if (isOnAprooving(documentReport) && !isNeedAprooving(documentReport))
      states.push('На согласовании')
    if (isNotWorked(documentReport)) states.push('Не обработано')
    return states
  }

  return {
    isDeadLine,
    isRedLine,
    isLastDelegationUnreaded,
    isNeedAprooving,
    getDocumentStates
  }
}
