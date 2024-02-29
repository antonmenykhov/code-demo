<template>
  <div class="form-card">
    <h1>{{ form.name }}</h1>
    <div class="form-info">
      <h3>Настройки формы</h3>
      <TextInput v-model:value="form.name" label="Название формы" />
      <div class="buttons-wrapper">
        <ButtonComponent text="Сохранить" type="success" @click="saveForm" />
      </div>
    </div>
    <div class="form-questions" v-if="questionTree">
      <h3>Список вопросов</h3>
      <QuestionElement
        :question="questionTree"
        @open-question-card="openQuestionCard"
        @delete-question="deleteQuestion"
      />
    </div>
    <QuestionCard ref="questionCard" @save-question="saveQuestion" />
  </div>
</template>
<script lang="ts" setup>
import QuestionCard from '@/components/question-managment/QuestionCard.vue'
import QuestionElement from '@/components/question-managment/QuestionElement.vue'
import useDefaultCrud from '@/composables/use-default-crud.composable'
import useQuestionManagment from '@/composables/use-question-managment.composable'
import type { CreateFormDto, Form } from '@/interfaces/form.inteface'
import type { Handbook } from '@/interfaces/hadnbook.interface'
import type { Question } from '@/interfaces/question.interface'
import { useHandbookStore } from '@/store/handbook.store'
import { storeToRefs } from 'pinia'
import { ButtonComponent, TextInput } from '@tnnc/tnnc-ui-kit'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { id } = route.params

const {
  getOne: getForm,
  create: createForm,
  update: updateForm
} = useDefaultCrud<Form, CreateFormDto>('form')

const form = ref<Form>({ id: 0, name: '' })

const { handbooks } = storeToRefs(useHandbookStore())
const { getAll } = useDefaultCrud<Handbook>('handbook')

getAll().then((data) => {
  handbooks.value = data
})

const { getQuestionTreeWrappered, saveQuestion, deleteQuestion, questionTree } =
  useQuestionManagment(form, updateForm)

async function saveForm() {
  if (form.value.id === 0) {
    createForm({ name: form.value.name }).then(({ data }) => {
      form.value = data
      getQuestionTreeWrappered()
    })
  } else {
    updateForm(form.value.id, { name: form.value.name, questions: form.value.questions })
  }
}
async function initCard() {
  if (+id) {
    form.value = await getForm(+id)
    getQuestionTreeWrappered()
  }
}
initCard()

const questionCard = ref<InstanceType<typeof QuestionCard>>()
function openQuestionCard(data: { question: Question; parentId?: number; childNumber: string }) {
  if (questionCard.value) questionCard.value.openCard(data)
}
</script>
<style lang="scss">
.buttons-wrapper {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
