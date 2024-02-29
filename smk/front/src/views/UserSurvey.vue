<template>
  <div>
    <div class="survey-answering" v-if="survey.length > 0">
      <h1>Удовлетворенность качеством обеспечивающих и вспомогательных бизнес-процессов</h1>
      <div class="groups">
        <UserQuestionGroup
          v-if="survey.length > 0"
          :alert-message-array="alertMessageArray"
          :current-group-index="currentQustionGroupIndex"
          :group-length="questionGroupsLength"
          :key="survey[currentQustionGroupIndex].id"
          v-model:question-group="survey[currentQustionGroupIndex]"
        />
        <div class="buttons">
          <ButtonComponent
            :disabled="isNavigationRestricted || currentQustionGroupIndex === 0"
            text="Предыдущий блок"
            css-class="reverse"
            icon-class="fa-solid fa-arrow-left"
            @click="prevQuestionGroup"
          />
          <ButtonComponent
            v-if="!isLastQuestionGroup"
            :disabled="isNavigationRestricted"
            text="Следующий блок"
            icon-class="fa-solid fa-arrow-right"
            @click="nextQuestionGroup"
          />
          <ButtonComponent
            v-else
            text="Завершить опрос"
            @click="setSurveyCompletion"
            :disabled="isNavigationRestricted"
          />
        </div>
      </div>
    </div>
    <div v-else class="error-wrapper">
      <h1>{{ error }}</h1>
    </div>
  </div>
</template>
<script lang="ts" setup>
import UserQuestionGroup from '@/components/user-survey-components.vue/UserQuestionGroup.vue'
import baseUrl from '@/config/baseUrl'
import { computed, inject, provide, ref, type Ref } from 'vue'
import { ButtonComponent, notify } from 'tnnc-ui-kit'
import type { Answer } from '@/interfaces/answer.interface'
import type { AxiosError, AxiosInstance } from 'axios'
import useHttp from '@/composables/use-http.composable'
import type { KeycloakInstance } from 'keycloak-js'
import type { QuestionGroup } from '@/interfaces/question-group.interface'

const keycloak = inject('keycloak') as KeycloakInstance
const { http: silentHttp } = useHttp(keycloak, notify, true)
const http = inject('http') as AxiosInstance
const survey: Ref<QuestionGroup[]> = ref([])
const currentQustionGroupIndex = ref(0)

function checkLastAnswered() {
  let hasAnswered = false
  survey.value.forEach((questionGroup, groupIndex) => {
    questionGroup.questions.forEach((question) => {
      if (question.answers && question.answers.length) {
        currentQustionGroupIndex.value = groupIndex
        hasAnswered = true
      }
    })
  })
  if (hasAnswered) nextQuestionGroup()
}

const error = ref('')

async function getSurvey() {
  http
    .get(`${baseUrl.baseUrl}/survey/`)
    .then(({ data }) => {
      survey.value = data
      checkLastAnswered()
    })
    .catch((err: AxiosError<{ error: string }>) => {
      if (err.response && err.response.data) {
        error.value = err.response.data.error
      }
    })
}
await getSurvey()

const questionGroupsLength = computed(() => {
  return survey.value.length || 0
})

const alertMessageArray = computed(() =>
  survey.value[currentQustionGroupIndex.value].questions.map((question) => {
    if (
      !question.answers ||
      question.answers.length === 0 ||
      question.answers[0]?.numericVariant === null ||
      question.answers[0]?.numericVariant === undefined
    )
      return 'Необходимо выбрать один из вариантов ответа'
    if (
      question.answers &&
      question.answers[0].numericVariant &&
      question.answers[0].numericVariant <= 7 &&
      (!question.answers[0].comment || question.answers[0].comment.length < 10)
    )
      return 'Необходимо указать комментарий длиной минимум 10 символов'

    return ''
  })
)

const isNavigationRestricted = computed(
  () =>
    alertMessageArray.value.reduce((acc: number, text: string) => {
      return (acc += text.length)
    }, 0) > 0
)

const isLastQuestionGroup = computed(
  () => currentQustionGroupIndex.value + 1 === questionGroupsLength.value
)

async function saveQuestionsInGroup() {
  for (let i = 0; i < survey.value[currentQustionGroupIndex.value].questions.length; i++) {
    if (survey.value && survey.value[currentQustionGroupIndex.value].questions[i].answers)
      await saveAnswer(survey.value[currentQustionGroupIndex.value]?.questions[i]?.answers?.[0], i)
  }
}

async function saveAnswer(answer: Answer | undefined, questionIndex: number) {
  if (answer && !isNavigationRestricted.value)
    await silentHttp
      .post(`${baseUrl.baseUrl}/answer`, {
        ...answer,
        id: undefined,
        periodId: undefined,
        questionId: undefined,
        userId: undefined,
        question: {
          ...survey.value[currentQustionGroupIndex.value].questions[questionIndex],
          answers: undefined
        }
      })
      .catch(() => {})
}

async function prevQuestionGroup() {
  await saveQuestionsInGroup()
  if (!isNavigationRestricted.value && currentQustionGroupIndex.value !== 0)
    currentQustionGroupIndex.value--
}

async function nextQuestionGroup() {
  await saveQuestionsInGroup()
  if (
    !isNavigationRestricted.value &&
    currentQustionGroupIndex.value + 1 !== questionGroupsLength.value
  )
    currentQustionGroupIndex.value++

  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}

function getCurrentQuestion(questionIndex: number) {
  return survey.value[currentQustionGroupIndex.value].questions[questionIndex]
}

function setAnswer(answer: number, questionIndex: number) {
  const newAnswer: Answer = {
    id: 1,
    question: { ...getCurrentQuestion(questionIndex), answers: undefined },
    ...getCurrentQuestion(questionIndex).answers?.[0],
    numericVariant: answer,
    comment:
      answer === 0
        ? 'Не взаимодействую с СП'
        : getCurrentQuestion(questionIndex).answers?.[0]?.comment
  }
  survey.value[currentQustionGroupIndex.value].questions[questionIndex].answers = [newAnswer]
}

function setComment(comment: string, questionIndex: number) {
  const newAnswer: Answer = {
    id: 1,
    question: { ...getCurrentQuestion(questionIndex), answers: undefined },
    ...getCurrentQuestion(questionIndex).answers?.[0],
    comment: comment
  }
  survey.value[currentQustionGroupIndex.value].questions[questionIndex].answers = [newAnswer]
}
provide('setAnswer', setAnswer)
provide('setComment', setComment)

async function setSurveyCompletion() {
  await saveQuestionsInGroup()
  silentHttp
    .post(`${baseUrl.baseUrl}/survey-completion`)
    .then(() => {
      survey.value = []
      error.value = 'Спасибо за Ваше участие!'
    })
    .catch()
}
</script>
<style lang="scss">
.survey-answering {
  .groups {
    min-height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .tnnc-button.reverse {
    flex-direction: row-reverse;
  }
  .tnnc-button-icon {
    height: unset;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .tnnc-button:disabled .tnnc-button-icon {
    opacity: 1;
  }
  .alert-message {
    color: var(--tnnc-color-red);
    margin-bottom: 10px;
    text-align: center;
  }
}
.error-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
