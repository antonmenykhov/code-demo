<template>
  <div class="question-group-wrapper">
    <div class="question-group-card">
      <div class="name">
        <TextInput
          :label="isEditing ? 'Название блока' : undefined"
          v-model:value="item.name"
          :disabled="!isEditing"
        />
      </div>
      <SelectBox
        :label="isEditing ? 'Ответственное подразделение' : undefined"
        :options="departments"
        display-expr="name"
        value-expr="id"
        :allow-search="true"
        v-model:value="item.departmentId"
        :disabled="!isEditing"
      />
      <Toggle
        v-model:value="item.disableZeroAnswers"
        label="Запретить ноль"
        :disabled="!isEditing"
      />
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
    <ResponsibleList v-if="isEditing" :employees="employees" v-model:question-group="item" />
    <SurveyQuestionTable v-if="isEditing" v-model:question-group="item" />
  </div>
</template>
<script lang="ts" setup>
import type { QuestionGroup } from '@/interfaces/question-group.interface'
import { ButtonComponent, TextInput, SelectBox, confirm, Toggle } from 'tnnc-ui-kit'
import { ref } from 'vue'
import SurveyQuestionTable from './SurveyQuestionTable.vue'
import type { Department } from '@/interfaces/department.interface'
import ResponsibleList from './ResponsibleList.vue'
import type { Employee } from '@/interfaces/employee.interface'

const props = defineProps<{
  listItem: QuestionGroup
  departments: Department[]
  employees: Employee[]
}>()

const emits = defineEmits<{
  (e: 'save', data: QuestionGroup): void
  (e: 'delete', data: QuestionGroup): void
}>()

const item = ref({ ...props.listItem })

const isEditing = ref(false)
function startEditing() {
  isEditing.value = true
}
function save() {
  isEditing.value = false
  emits('save', item.value)
}
function stopEditing() {
  isEditing.value = false
  item.value = {
    ...props.listItem,
    questions: item.value.questions,
    responsibles: item.value.responsibles
  }
}
function deleteItem() {
  confirm('Удалить группу вопросов?')
    .then(() => {
      emits('delete', props.listItem)
    })
    .catch(() => {})
}
</script>
<style lang="scss">
.question-group-wrapper {
  width: 100%;
}
.question-group-card {
  display: flex;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  gap: 10px;
  &.align-end {
    .type,
    .buttons {
      align-self: flex-end;
    }
  }
  .buttons {
    width: fit-content;
  }
  .name {
    flex: 1;
    & > * {
      width: 100%;
    }
  }
  i {
    margin-right: 0;
  }
}
.tnnc-draggable-list-item button {
  background: white;
}
.tnnc-draggable-list-item .tnnc-button.default {
  background: var(--tnnc-color-orange);
}
</style>
