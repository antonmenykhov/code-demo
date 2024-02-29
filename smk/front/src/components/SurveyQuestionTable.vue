<template>
  <div class="question-table">
    <h4>Вопросы в блоке</h4>
    <div class="question-group-card new-item-form align-end">
      <div class="name">
        <TextAreaInput
          v-model:value="newQuestionText"
          label="Новый вопрос"
          placeholder="Введите текст вопроса"
          @submited="addQuestion"
          :show-counter="false"
          :rows="3"
        />
      </div>
      <div class="buttons">
        <ButtonComponent
          text="Добавить"
          @click="addQuestion"
          reverse
          icon-class="fa-solid fa-add"
          type="success"
        />
      </div>
    </div>
    <DraggableList
      :items="questionsSorted"
      :list-name="`questions${questionGroup.id}`"
      :available-list-names="[`questions${questionGroup.id}`]"
      @dragging="reorder"
      list-css-class="survey-questions"
    >
      <template #listItem="{ listItem }">
        <QuestionCard
          :key="listItem.id"
          :question="listItem"
          @save="updateQuestion"
          @delete="deleteQuestion"
        />
      </template>
    </DraggableList>
  </div>
</template>
<script lang="ts" setup>
import baseUrl from '@/config/baseUrl'
import type { QuestionGroup } from '@/interfaces/question-group.interface'
import type { Question } from '@/interfaces/question.interface'
import type { AxiosInstance } from 'axios'
import { DraggableList, ButtonComponent, TextAreaInput } from 'tnnc-ui-kit'
import { defineProps, computed, inject, ref } from 'vue'
import QuestionCard from './QuestionCard.vue'

export interface QuestionExtended extends Question {
  typeId: number
}
const http = inject('http') as AxiosInstance
const props = defineProps<{
  questionGroup: QuestionGroup
}>()
const emit = defineEmits<{ (e: 'update:questionGroup', data: QuestionGroup): void }>()
const url = `${baseUrl.baseUrl}/question`

const questionsSorted = computed(() =>
  [...props.questionGroup.questions].sort((a, b) => a.order - b.order)
)

const newQuestionText = ref('')

function addQuestion() {
  const newQuestion: Question = {
    id: -1,
    text: newQuestionText.value,
    group: props.questionGroup,
    order:
      questionsSorted.value.length > 0
        ? questionsSorted.value[questionsSorted.value.length - 1].order + 1
        : 1
  }
  http.post(url, { ...newQuestion, id: undefined }).then(({ data }) => {
    emit('update:questionGroup', {
      ...props.questionGroup,
      questions: [...props.questionGroup.questions, data]
    })
    newQuestionText.value = ''
  })
}

function deleteQuestion(e: Question) {
  http.delete(`${url}/${e.id}`).then(() => {
    const index = props.questionGroup.questions.findIndex((question) => question.id === e.id)
    if (index !== undefined && index !== -1) {
      const newQuestions = [...props.questionGroup.questions]
      newQuestions.splice(index, 1)
      emit('update:questionGroup', { ...props.questionGroup, questions: newQuestions })
    }
  })
}

function updateQuestion(e: Question) {
  const newQuestion: Question = {
    id: e.id,
    text: e.text,
    group: props.questionGroup,
    order: e.order
  }
  http.patch(`${url}/${e.id}`, { ...newQuestion, id: undefined }).then(() => {
    const newQuestions = props.questionGroup?.questions || []
    const index = newQuestions.findIndex((question) => question.id === e.id)
    if (index !== undefined && index !== -1) {
      const newQuestions = [...props.questionGroup.questions]
      newQuestions.splice(index, 1, e)
      emit('update:questionGroup', { ...props.questionGroup, questions: newQuestions })
    }
  })
}

function reorder(e: { oldIndex: number; oldList: string; newIndex: number; newList: string }) {
  if (e.newList === e.oldList) {
    const toItem =
      e.newIndex !== -1
        ? questionsSorted.value[e.newIndex]
        : questionsSorted.value[questionsSorted.value.length - 1]
    const fromItem = questionsSorted.value[e.oldIndex]
    if (props.questionGroup)
      http
        .post(`${url}/reorder/${props.questionGroup.id}`, {
          newOrder: e.newIndex !== -1 ? toItem.order : toItem.order + 1,
          oldOrder: fromItem.order
        })
        .then(({ data }) => {
          emit('update:questionGroup', { ...props.questionGroup, questions: data })
        })
  }
}
</script>
<style lang="scss">
.question-table {
  background: rgb(226 237 249);
  padding: 5px;
  margin: 10px 0;
  border-radius: 5px;
}
</style>
