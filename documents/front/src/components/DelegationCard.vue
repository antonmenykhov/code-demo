<template>
  <div class="delegation-card">
    <Card size="small" class="delegation-card" :style="`margin-left: ${level * 20}px`">
      <template #extra>
        <p class="delegation-text"><span>Срок до:</span></p>
        <p class="delegation-text">{{ useDateFormat(delegation.date, 'DD.MM.YYYY').value }}</p>
      </template>
      <template #title>
        <p class="delegation-text"><span>От:</span> {{ fromComputed }}</p>
        <p class="delegation-text">
          <span>Кому:</span>
          {{ toComputed }}
        </p>
      </template>
      <p>{{ delegation.description }}</p>
      <h4 v-if="delegation.comments.length">Комментарии</h4>
      <div class="comment" v-for="comment in comments" :key="comment.id">
        <h5>{{ getUserName(comment.fromId) }}:</h5>
        <p>{{ comment.comment }}</p>
      </div>
      <Row justify="end" class="row-end" v-if="!isCompleted">
        <Dropdown placement="bottomRight" v-if="canSend">
          <template #overlay>
            <Menu>
              <MenuItem v-if="isInitier" :key="0" @click="() => setToManager()"
                >Руководителю на рассмотрение</MenuItem
              >
              <MenuItem v-if="isManager" :key="1" @click="() => setToInitier()"
                >На исполнение инициатору</MenuItem
              >
              <MenuItem v-if="isManager || isInitier" :key="2" @click="() => setToWorker()"
                >На исполнение поручения</MenuItem
              >

              <MenuItem
                v-if="isWorker || isInitier"
                :key="3"
                @click="() => setCommentAndSendForAprooving()"
                >На утверждение руководителю</MenuItem
              >
              <MenuItem v-if="isWorker" :key="4" @click="() => setToWorker()"
                >Переадресовать поручение</MenuItem
              >
              <MenuItem
                v-if="(isWorker && canAddChild) || isHasDocumentAssignComment"
                :key="5"
                @click="() => createChildOutDocument()"
                >Подготовить ответ</MenuItem
              >
            </Menu>
          </template>
          <Button type="primary">Отправить</Button>
        </Dropdown>

        <Button v-if="canAproove" @click="() => setAprooving()" :loading="approvingButtonLoading">
          Согласовано
        </Button>
        <Button v-if="canAproove" @click="() => setReturning()" danger>Отклонить</Button>
        <Button v-if="canSetWithoutAnswer && canSend" @click="() => setWithoutAnswer()" danger>
          Не требует действия
        </Button>
      </Row>
      <Button v-if="isHasDocumentAssignComment" @click="() => createChildOutDocument()">
        Отредактировать документ
      </Button>
    </Card>
    <DelegationCard
      v-for="child in childDelegations"
      :key="child.id"
      :delegation="child"
      :delegations="delegations"
      :level="level + 1"
      :is-completed="isCompleted"
      :canAddChild="canAddChild"
      :users="users"
      :can-set-without-answer="canSetWithoutAnswer"
      @set-aprooving="setAprooving"
      @set-to-initier="setToInitier"
      @create-child-out-document="createChildOutDocument"
      @set-to-manager="setToManager"
      @set-comment-and-send-for-aprooving="setCommentAndSendForAprooving"
      @set-to-worker="setToWorker"
      @set-returning="setReturning"
      @set-without-answer="setWithoutAnswer"
    >
    </DelegationCard>
  </div>
</template>
<script lang="ts" setup>
import type { Delegation } from '@/interfaces/delegation.interface'
import type { User } from '@/interfaces/user.interface'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useDateFormat } from '@vueuse/core'
import { Card, Button, Dropdown, Menu, MenuItem, Row } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { isInitier, isManager, isWorker, myId } = storeToRefs(useUserInfoStore())
const props = withDefaults(
  defineProps<{
    delegation: Delegation
    delegations: Delegation[]
    level?: number
    isCompleted?: boolean
    canAddChild: boolean
    users: User[]
    canSetWithoutAnswer: boolean
  }>(),
  {
    level: 0
  }
)
const emit = defineEmits<{
  (e: 'setToInitier', delegationId: number): void
  (e: 'setToWorker', delegationId: number): void
  (e: 'setCommentAndSendForAprooving', delegationId: number): void
  (e: 'createChildOutDocument', delegationId: number): void
  (e: 'setAprooving', delegationId: number): void
  (e: 'setToManager', delegationId: number): void
  (e: 'setReturning', delegationId: number): void
  (e: 'setWithoutAnswer'): void
}>()
const childDelegations = computed(() =>
  props.delegations.filter((del) => del.parentId === props.delegation.id)
)
const canAproove = computed(
  () =>
    props.delegation.isNeedAprooving &&
    !props.delegation.isAprooved &&
    props.delegation.fromId === myId.value
)
const canSend = computed(
  () =>
    props.delegation.toId === myId.value &&
    props.delegation.isActive === true &&
    !props.delegation.isNeedAprooving &&
    (childDelegations.value.length === 0 || isInitier.value || isManager.value)
)

function setAprooving(delegationId: number | undefined = undefined) {
  setLoadingAproovingButtons()
  emit('setAprooving', delegationId || props.delegation.id)
}
function createChildOutDocument(delegationId: number | undefined = undefined) {
  emit('createChildOutDocument', delegationId || props.delegation.id)
}
function setToWorker(delegationId: number | undefined = undefined) {
  emit('setToWorker', delegationId || props.delegation.id)
}
function setCommentAndSendForAprooving(delegationId: number | undefined = undefined) {
  emit('setCommentAndSendForAprooving', delegationId || props.delegation.id)
}
function setToInitier(delegationId: number | undefined = undefined) {
  emit('setToInitier', delegationId || props.delegation.id)
}
function setToManager(delegationId: number | undefined = undefined) {
  emit('setToManager', delegationId || props.delegation.id)
}
function setReturning(delegationId: number | undefined = undefined) {
  emit('setReturning', delegationId || props.delegation.id)
}
function setWithoutAnswer() {
  emit('setWithoutAnswer')
}

const approvingButtonLoading = ref(false)
function setLoadingAproovingButtons() {
  approvingButtonLoading.value = true
  setTimeout(() => (approvingButtonLoading.value = false), 1000)
}

function getSmallFio(fullFio: string) {
  const fioArr = fullFio.split(' ')
  if (fioArr.length > 1) fioArr.push(' ')

  return `${fioArr[0]} ${fioArr
    .slice(1)
    .map((part) => part[0])
    .join('. ')}`
}

const from = computed(
  () =>
    `${getSmallFio(props.delegation.from?.lastName || '')} (${props.delegation.from?.firstName})`
)

const fromComputed = computed(() =>
  props.delegation.description === 'Нужно утвердить' ? to.value : from.value
)
const toComputed = computed(() =>
  props.delegation.description === 'Нужно утвердить' ? from.value : to.value
)

const to = computed(
  () => `${getSmallFio(props.delegation.to?.lastName || '')} (${props.delegation.to?.firstName})`
)

function getUserName(id: string) {
  return props.users.find((user) => user.id === id)?.lastName || ''
}

const comments = computed(() => [...props.delegation.comments].sort((a, b) => a.id - b.id))

const isHasDocumentAssignComment = computed(() =>
  comments.value.some(
    (comment) => comment.comment === 'Прикрепил документ' && comment.fromId === myId.value
  )
)
</script>
<style lang="scss">
.comment {
  background: #e2e2e2;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  h5 {
    margin-top: 0;
    margin-bottom: 5px;
  }
  p {
    margin: 0;
  }
}
.delegation-card {
  h4 {
    margin-bottom: 10px;
  }
}
.delegation-text {
  font-weight: 500;
  margin: 0;
  span {
    font-size: 0.75rem;
    font-weight: 400;
  }
}
</style>
