<template>
  <Popover placement="bottomLeft">
    <template #content>
      <div
        class="delegation-state"
        :class="[delegation.cssClass]"
        v-for="(delegation, index) in getDelegations(record.delegations)"
        :key="index"
      >
        {{ delegation.user }} - {{ delegation.status }}
      </div>
    </template>
    <Tag color="blue" v-if="record.states.includes('В работе')">В работе</Tag>
    <Tag color="green" v-if="record.states.includes('Исполнено')">Исполнено</Tag>
    <Tag color="red" v-if="record.states.includes('Не обработано')">Не обработано</Tag>
    <Tag color="red" v-if="record.states.includes('Не прочитано')">Не прочитано</Tag>
    <Tag color="green" v-if="record.states.includes('Истекает срок исполнения')">
      Истекает срок исполнения
    </Tag>
    <Tag color="yellow" v-if="record.states.includes('Срок исполнения истек')">
      Срок исполнения истек
    </Tag>
    <Tag color="red" v-if="record.states.includes('Нужно согласование')">Нужно согласование</Tag>
    <Tag color="yellow" v-if="record.states.includes('На согласовании')"> На согласовании </Tag>
    <Tag color="green" v-if="record.states.includes('Подписано')">Подписано</Tag>
  </Popover>
</template>
<script lang="ts" setup>
import type { Delegation } from '@/interfaces/delegation.interface'
import type { DocumentReport } from '@/interfaces/document-item.interface'
import type { User } from '@/interfaces/user.interface'
import { useHandbookStore } from '@/stores/handbookStore'
import { Tag, Popover } from 'ant-design-vue'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  record: DocumentReport
}>()

const { users } = storeToRefs(useHandbookStore())

function getDelegationStatus(delegation: Delegation, user?: User) {
  if (delegation.isReaded === false) return { status: 'Не прочитано', cssClass: 'red' }
  if (delegation.isReaded === true && delegation.isAprooved === true && delegation.isNeedAprooving)
    return {
      status: user?.clientRoles?.['documents'].includes('Manager') ? 'Утверждено' : 'Согласовано',
      cssClass: ''
    }
  if (
    props.record.readingMarks.find((mark) => mark.userId === delegation.toId) &&
    !props.record.child
  )
    return { status: 'Ознакомлен(а)', cssClass: '' }
  if (
    (props.record.isIncoming && props.record.child && delegation.isNeedAprooving) ||
    (!props.record.isIncoming && props.record.isCompleted)
  )
    return { status: 'Исполнено', cssClass: 'green' }
  if (props.record.isCompleted) return { status: 'Завершено', cssClass: '' }
  return { status: 'В работе', cssClass: '' }
}

function getDelegations(delegations: Delegation[]) {
  return delegations.map((delegation) => {
    const user = users.value.find(
      (user) =>
        user.id ===
        (delegation.description === 'Нужно утвердить' ? delegation.fromId : delegation.toId)
    )
    return {
      user: user?.lastName,
      ...getDelegationStatus(delegation, user)
    }
  })
}
</script>
