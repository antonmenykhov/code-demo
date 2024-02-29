<template>
  <div class="question-group-wrapper">
    <div class="question-group-card" :class="{ 'align-end': isEditing }">
      <div class="name">
        <TextAreaInput
          v-if="isEditing"
          label="Текст вопроса"
          v-model:value="questionEditable.text"
          :show-counter="false"
          :rows="3"
        />
        <TextInput v-else :value="questionEditable.text" disabled />
      </div>
      <div class="type"></div>
      <div class="buttons">
        <ButtonComponent
          v-if="!isEditing"
          icon-class="fa-solid fa-pen"
          type="default"
          @click="startEditing"
        />
        <ButtonComponent
          v-if="!isEditing"
          icon-class="fa-solid fa-trash"
          type="danger"
          @click="deleteItem"
        />
        <ButtonComponent
          v-if="isEditing"
          icon-class="fa-solid fa-save"
          type="success"
          @click="save"
        />
        <ButtonComponent
          v-if="isEditing"
          icon-class="fa-solid fa-close"
          type="danger"
          @click="stopEditing"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Question } from '@/interfaces/question.interface'
import { TextInput, ButtonComponent, TextAreaInput, confirm } from 'tnnc-ui-kit'
import { ref, type Ref } from 'vue'

const props = defineProps<{
  question: Question
}>()
const emits = defineEmits<{
  (e: 'save', data: Question): void
  (e: 'delete', data: Question): void
}>()

const questionEditable: Ref<Question> = ref({ ...props.question })
const isEditing = ref(false)

function startEditing() {
  questionEditable.value = { ...props.question }
  isEditing.value = true
}
function save() {
  isEditing.value = false
  emits('save', questionEditable.value)
}
function stopEditing() {
  isEditing.value = false
  questionEditable.value = { ...props.question }
}
function deleteItem() {
  confirm('Удалить вопрос?')
    .then(() => {
      emits('delete', props.question)
    })
    .catch(() => {})
}
</script>
<style lang="scss"></style>
