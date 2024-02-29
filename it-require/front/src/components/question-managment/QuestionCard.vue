<template>
  <PopupComponent v-model:visible="isPopupVisible" :title="title" close-on-outside-click>
    <div class="question-card" v-if="question">
      <Toggle v-model:value="question.isGroup" label="Это группа" />
      <TextAreaInput v-model:value="question.text" label="Текст" :show-counter="false" :rows="4" />
      <SelectBox
        v-if="!question.isGroup"
        v-model:value="question.type"
        :options="questionTypes"
        display-expr="name"
        value-expr="value"
        label="Тип вопроса"
      />
      <Toggle
        v-if="!question.isGroup"
        v-model:value="question.isRequired"
        label="Ответ обязателен"
      />
      <TextAreaInput
        v-if="!question.isGroup"
        v-model:value="question.description"
        label="Описание"
        :show-counter="false"
        :rows="4"
      />
      <SelectBox
        v-if="!question.isGroup && question.type === 'handbook'"
        :options="handbooks"
        allow-search
        v-model:value="question.handbookId"
        show-clear-button
        display-expr="name"
        value-expr="id"
        label="Используемый справочник"
      />
      <TextInput
        v-if="!question.isGroup"
        v-model:value="question.conditionParentValue"
        label="Ответ на родительский вопрос, при котором появится данный вопрос"
        show-clear-button
        placeholder="Если пусто, то появляется всегда"
      />
      <ButtonComponent text="Сохранить" @click="saveQuestion" />
    </div>
  </PopupComponent>
</template>
<script lang="ts" setup>
import type { Question } from '@/interfaces/question.interface'
import { useHandbookStore } from '@/store/handbook.store'
import { storeToRefs } from 'pinia'
import {
  PopupComponent,
  SelectBox,
  TextAreaInput,
  Toggle,
  TextInput,
  ButtonComponent
} from '@tnnc/tnnc-ui-kit'
import { computed, ref } from 'vue'

const isPopupVisible = ref(false)
const entityName = computed(() => (question.value?.isGroup ? 'группы' : 'вопроса'))
const title = computed(() =>
  question.value?.id === 0 ? `Создание ${entityName.value}` : `Редактирование ${entityName.value}`
)
const question = ref<Question>()
const parentId = ref<number>()
const childNumber = ref('')

const { questionTypes, handbooks } = storeToRefs(useHandbookStore())

function openCard(data: { question: Question; parentId?: number; childNumber: string }) {
  question.value = data.question
  parentId.value = data.parentId
  childNumber.value = data.childNumber
  isPopupVisible.value = true
}
const emit = defineEmits<{
  (e: 'saveQuestion', data: { question: Question; parentId?: number; childNumber: string }): void
}>()
function saveQuestion() {
  if (!question.value) return
  emit('saveQuestion', {
    question: question.value,
    parentId: parentId.value,
    childNumber: childNumber.value
  })
  isPopupVisible.value = false
}
defineExpose({ openCard })
</script>
<style lang="scss">
.question-card {
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
}
</style>
