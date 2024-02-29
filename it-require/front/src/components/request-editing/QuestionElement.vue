<template>
  <div class="request-question-element" :style="`margin-left: ${level * 20}px`">
    <div v-if="question.isGroup" class="group-title">{{ question.text }}</div>
    <div class="question-card-wrapper" v-else>
      <div class="question-editor">
        <TextAreaInput
          v-if="question.type === 'string'"
          v-model:value="editableAnswer"
          :label="question.text"
          :show-counter="false"
          :rows="1"
          autosize
          :disabled="!canManageCard"
          :placeholder="question.description || undefined"
          :invalid="isInvalid"
          invalid-text="Обязательно к заполнению"
        />
        <SelectBox
          v-if="question.type === 'handbook'"
          :options="usedHandbook"
          display-expr="name"
          value-expr="name"
          v-model:value="editableAnswer"
          allow-search
          :label="question.text"
          :disabled="!canManageCard"
          :placeholder="question.description || undefined"
          :invalid="isInvalid"
          invalid-text="Обязательно к заполнению"
        />
        <DatePicker
          v-if="question.type === 'date'"
          :label="question.text"
          :disabled="!canManageCard"
          v-model:value="editableAnswer"
          :placeholder="question.description || undefined"
          :invalid="isInvalid"
          invalid-text="Обязательно к заполнению"
        />
        <NumberInput
          v-if="question.type === 'number'"
          :label="question.text"
          :value="+editableAnswer"
          @update:value="(val) => (editableAnswer = `${val}`)"
          :disabled="!canManageCard"
          :placeholder="question.description || undefined"
          :invalid="isInvalid"
          invalid-text="Обязательно к заполнению"
        />
      </div>
      <div class="question-comments">
        <ButtonComponent
          v-if="canManageComments"
          icon-class="fa-solid fa-comment"
          title="Добавить комментарий"
          @click="openCommentCard"
        />
        <div class="comment-list">
          <RequestCommentComponent
            v-for="comment in commentsToRequest"
            :key="comment.id"
            :comment="comment"
          />
        </div>
      </div>
    </div>
    <div class="request-question-children">
      <template v-for="child in childOrdered" :key="child.id">
        <QuestionElement
          v-if="!child.conditionParentValue || child.conditionParentValue === editableAnswer"
          :question="child"
          :handbooks="handbooks"
          :request-id="requestId"
          :level="level + 1"
          :answers="answers"
          :comments="comments"
          :can-manage-card="canManageCard"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Answer } from '@/interfaces/answer.interface'
import type { Handbook } from '@/interfaces/hadnbook.interface'
import type { Question } from '@/interfaces/question.interface'
import type { RequestComment } from '@/interfaces/request.interface'
import { useLockStore } from '@/store/lock.store'
import { storeToRefs } from 'pinia'
import {
  ButtonComponent,
  DatePicker,
  NumberInput,
  SelectBox,
  TextAreaInput
} from '@tnnc/tnnc-ui-kit'
import { computed, inject } from 'vue'
import RequestCommentComponent from './RequestCommentComponent.vue'

const { canManageComments } = storeToRefs(useLockStore())

const props = withDefaults(
  defineProps<{
    question: Question
    requestId: number
    handbooks: Handbook[]
    level?: number
    answers: Answer[]
    comments: RequestComment[]
    canManageCard: boolean
  }>(),
  { level: 0 }
)

const existAnswerIndex = computed(() =>
  props.answers.findIndex((answer) => answer.questionId === props.question.id)
)
const setAnswer = inject<(index: number, answer: Answer) => void>('setAnswer')
const removeAnswerByQuestion = inject<(id: number) => void>('removeAnswerByQuestion')
const editableAnswer = computed<string>({
  get() {
    return existAnswerIndex.value === -1 ? '' : props.answers[existAnswerIndex.value].answer
  },
  set(newValue) {
    if (existAnswerIndex.value !== -1 && newValue !== props.answers[existAnswerIndex.value].answer)
      removeDependsAnswers()
    setNewAnswer(newValue)
  }
})

function setNewAnswer(newValue: string) {
  if (!setAnswer || !removeAnswerByQuestion) return
  if (!newValue) return removeAnswerByQuestion(props.question.id)
  if (existAnswerIndex.value === -1) {
    setAnswer(existAnswerIndex.value, {
      id: 0,
      answer: newValue,
      questionId: props.question.id,
      requestId: props.requestId
    })
  } else {
    setAnswer(existAnswerIndex.value, {
      ...props.answers[existAnswerIndex.value],
      answer: newValue
    })
  }
}

function getDependIds(question: Question) {
  const ids = []
  if (question.id !== props.question.id && question.conditionParentValue) ids.push(question.id)
  question.children?.forEach((child) => {
    ids.push(...getDependIds(child))
  })
  return ids
}

function removeDependsAnswers() {
  if (!removeAnswerByQuestion) return
  getDependIds(props.question).forEach((id) => removeAnswerByQuestion(id))
}

const usedHandbook = computed(
  () => props.handbooks.find((handbook) => handbook.id === props.question.handbookId)?.items || []
)

const commentsToRequest = computed(() =>
  props.comments.filter((comment) => comment.questionId === props.question.id)
)

const openCommentCardInjected = inject<(comment: RequestComment) => void>('openCommentCard')
function openCommentCard() {
  if (openCommentCardInjected)
    openCommentCardInjected({
      id: 0,
      requestId: props.requestId,
      questionId: props.question.id,
      comment: '',
      userId: ''
    })
}

const isInvalid = computed(() => props.question.isRequired && !editableAnswer.value)
const childOrdered = computed(() =>
  [...(props.question.children || [])].sort((a, b) => a.id - b.id)
)
</script>
<style lang="scss">
.request-question-element {
  transition: all 0.2s;
  margin-bottom: 7px;
  border-bottom: 1px solid #e7e7e7;
  padding: 5px;
  &:last-child {
    border-bottom: none;
  }
  .question-card-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: flex-start;
    .question-editor {
      flex: 8 1 300px;
      max-width: 1000;
    }
    .question-comments {
      flex: 1 1 300px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
      .comment-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
        flex: 1;
      }
    }
  }
}
.group-title {
  margin: 10px 0;
  font-weight: 500;
  font-size: 18px;
}
</style>
