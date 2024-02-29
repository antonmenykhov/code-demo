<template>
  <div class="create-request-card" ref="requestCard">
    <div class="row">
      <div class="col">
        <h1>{{ title }}</h1>
        <div class="form-selection-list" v-if="canManageCard">
          <a
            v-for="form in formList"
            :key="form.id"
            @click="selectForm(form.id)"
            :class="{ selected: form.id === selectedForm?.id }"
            >{{ form.name }}</a
          >
        </div>
      </div>
      <div class="col">
        <div class="progress">
          <div class="title">Процент заполнения: {{ progressCount }}</div>
          <div class="progress-bar">
            <div class="bar" :style="`width: ${progressCount}%`"></div>
          </div>
        </div>
        <ButtonComponent
          v-if="canManageCard"
          text="Отправить заявку"
          type="success"
          icon-class="fa-solid fa-arrow-right"
          :disabled="invalidFieldsCount > 0"
          @click="saveRequest"
        />
        <div class="aprooving-buttons">
          <ButtonComponent
            v-if="canReturn"
            type="danger"
            text="Вернуть"
            @click="setPreviousStage"
          />
          <ButtonComponent
            v-if="canAproove"
            type="success"
            text="След. этап"
            @click="setNextStage"
          />
        </div>
      </div>
    </div>
    <QuestionElement
      v-for="question in childOrdered"
      :key="question.id"
      :question="question"
      :request-id="request?.id || 0"
      :handbooks="handbooks"
      :answers="answers"
      :comments="request?.comments || []"
      :canManageCard="canManageCard"
    />
    <RequestCommentModal ref="requestCommentModal" @save-comment="saveComment" />
  </div>
</template>
<script lang="ts" setup>
import useDefaultCrud from '@/composables/use-default-crud.composable'
import type { Form } from '@/interfaces/form.inteface'
import type { Question } from '@/interfaces/question.interface'
import { computed, nextTick, provide, ref } from 'vue'
import QuestionElement from '@/components/request-editing/QuestionElement.vue'
import { ButtonComponent, confirm } from '@tnnc/tnnc-ui-kit'
import type { Answer } from '@/interfaces/answer.interface'
import type { CreateRequestComment, Request, RequestComment } from '@/interfaces/request.interface'
import { useRoute } from 'vue-router'
import useRequestCardEdit from '@/composables/use-request-card-edit.composable'
import useRequestCardAdditionalLogic from '@/composables/use-request-card-additional-logic.composable'
import RequestCommentModal from '@/components/request-editing/RequestCommentModal.vue'
import { storeToRefs } from 'pinia'
import { useHandbookStore } from '@/store/handbook.store'
import type { UserRepresentation } from '@/interfaces/defs/userRepresentation'
import useCardAprooving from '@/composables/use-card-aprooving.composable'
import useCardAdditional from '@/composables/use-card-additional.composable'

const route = useRoute()

const { id } = route.params

const {
  collection: formList,
  getAll: getAllForms,
  getOne: getOneForm
} = useDefaultCrud<Form>('form')

const selectedForm = ref<Form>()
const questionTree = ref<Question>()
const answers = ref<Answer[]>([])
const request = ref<Request>()
const childOrdered = computed(() =>
  [...(questionTree.value?.children || [])].sort((a, b) => a.id - b.id)
)

const { getOne: getOneQuestion } = useDefaultCrud<Question>('question', undefined, undefined, false)
const { getQuestionCount, progressCount, getHandbooks, handbooks } = useRequestCardAdditionalLogic(
  answers,
  questionTree
)

const { saveRequest, removeAnswerByQuestion, setAnswer, getOneWithAnswersAndForm } =
  useRequestCardEdit(request, selectedForm, answers)
provide('setAnswer', setAnswer)
provide('removeAnswerByQuestion', removeAnswerByQuestion)

async function selectForm(id?: number) {
  answers.value = []
  if (!id) return
  selectedForm.value = await getOneForm(id)
  if (selectedForm.value.questions?.length)
    questionTree.value = await getOneQuestion(selectedForm.value.questions[0].id)
  getHandbooks()
  nextTick(() => {
    getQuestionCount()
  })
}

async function initCard() {
  await getAllForms()
  if (id === 'new') selectForm(formList.value[0]?.id)
  if (id !== 'new' && !isNaN(+id)) {
    request.value = await getOneWithAnswersAndForm(+id)

    if (request.value.form) await selectForm(request.value.form.id)
    answers.value = [...(request.value.answers || [])]
  }
}
initCard()

const {
  create: createComment,
  update: updateComment,
  remove: removeComment
} = useDefaultCrud<RequestComment, CreateRequestComment>('request-comment')
const requestCommentModal = ref<InstanceType<typeof RequestCommentModal>>()
function openCommentCard(comment: RequestComment) {
  if (!requestCommentModal.value) return
  requestCommentModal.value.openPopup(comment)
}
provide('openCommentCard', openCommentCard)
function deleteComment(comment: RequestComment) {
  confirm('Удалить коментарий?')
    .then(() => {
      removeComment(comment.id).then(() => {
        if (!request.value) return
        const existIndex =
          request.value?.comments?.findIndex((existComment) => comment.id === existComment.id) ?? -1
        if (existIndex !== -1) {
          request.value?.comments?.splice(existIndex, 1)
        }
      })
    })
    .catch(() => {})
}
provide('deleteComment', deleteComment)

async function saveComment(requestComment: RequestComment) {
  if (!request.value) return
  const { id, questionId, requestId, comment } = requestComment
  if (id === 0) {
    createComment({ questionId, requestId, comment }).then(({ data }) => {
      request.value?.comments?.push(data)
    })
  } else {
    updateComment(id, { questionId, requestId, comment }).then(({ data }) => {
      const existIndex =
        request.value?.comments?.findIndex((existComment) => existComment.id === data.id) || -1
      request.value?.comments?.splice(existIndex, 1, data)
    })
  }
}

const { users } = storeToRefs(useHandbookStore())
const { getAll } = useDefaultCrud<UserRepresentation>('users')
getAll().then((data) => {
  users.value = data
})

const { canAproove, canReturn, setNextStage, setPreviousStage } = useCardAprooving(
  request,
  getOneWithAnswersAndForm
)
const requestCard = ref<HTMLElement>()
const { canManageCard, title, invalidFieldsCount } = useCardAdditional(request, id, requestCard)
</script>
<style lang="scss">
.form-selection-list {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  margin-left: 5px;
  a {
    padding: 5px;
  }
  a.selected {
    background: var(--tnnc-color-blue);
    color: white;
    border-radius: 5px;
    text-decoration: none;
  }
}
.create-request-card {
  .row {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 10px;
    align-items: center;
  }
}

.progress {
  width: 300px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  border-radius: 15px;
  background: white;
  margin: 10px 0 20px;
  .bar {
    border-radius: 5px;
    background: var(--tnnc-color-blue);
    height: 100%;
    transition: all 0.2s;
  }
}
.aprooving-buttons {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}
</style>
