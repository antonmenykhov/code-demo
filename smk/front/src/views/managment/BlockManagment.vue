<template>
  <div class="containter">
    <h1>Блоки вопросов</h1>
    <div class="question-group-card new-item-form">
      <div class="name">
        <TextInput
          v-model:value="newBlockName"
          label="Новый блок вопросов"
          placeholder="Название нового блока вопросов"
          :invalid="nameValidator.length > 0"
          :invalid-text="nameValidator"
        />
      </div>
      <SelectBox
        label="Ответственное подразделение"
        :options="departments"
        display-expr="name"
        value-expr="id"
        :allow-search="true"
        v-model:value="newBlockDepartmentId"
        :invalid="departmentIdValidator.length > 0"
        :invalid-text="departmentIdValidator"
      />
      <Toggle v-model:value="newBlockDisableZeroAnswers" label="Запретить ноль" />
      <div class="buttons">
        <ButtonComponent
          text="Добавить"
          type="success"
          reverse
          icon-class="fa-solid fa-add"
          :disabled="departmentIdValidator.length > 0 || nameValidator.length > 0"
          @click="addBlock"
        />
      </div>
    </div>
    <DraggableList
      list-name="groups"
      :available-list-names="['groups']"
      :items="questionGroups"
      placeholder="Блоков вопросов нет"
      @dragging="reorderBlock"
      list-css-class="survey-groups"
    >
      <template #listItem="{ listItem }">
        <QuestionGroupCard
          :key="listItem.id"
          :list-item="listItem"
          :departments="departments"
          :employees="employees"
          @delete="deleteBlock"
          @save="changeBlock"
        />
      </template>
    </DraggableList>
  </div>
</template>
<script lang="ts" setup>
import useBlocks from '@/composables/use-blocks.composable'
import useDepartments from '@/composables/use-departments.composable'
import useEmployees from '@/composables/use-employees.composable'
import { ButtonComponent, DraggableList, SelectBox, TextInput, Toggle } from 'tnnc-ui-kit'
import { computed, ref } from 'vue'
import QuestionGroupCard from '@/components/QuestionGroupCard.vue'
import type { QuestionGroup } from '@/interfaces/question-group.interface'

const { departments } = useDepartments()
const { employees } = useEmployees()
const {
  questionGroups,
  addQuestionGroup,
  changeQuestionGroup,
  deleteQuestionGroup,
  reorderQuestionGroup
} = useBlocks()

const newBlockName = ref('')
const newBlockDepartmentId = ref('')
const newBlockDisableZeroAnswers = ref(false)
function addBlock() {
  addQuestionGroup(
    newBlockName.value,
    newBlockDepartmentId.value,
    newBlockDisableZeroAnswers.value
  ).then(() => {
    newBlockName.value = ''
    newBlockDepartmentId.value = ''
    newBlockDisableZeroAnswers.value = false
  })
}

const nameValidator = computed(() => {
  if (newBlockName.value.length === 0) return 'Название блока не может быть пустым'
  if (questionGroups.value.find((group) => group.name === newBlockName.value))
    return 'Название блока не должно повторяться'
  return ''
})

const departmentIdValidator = computed(() => {
  if (newBlockDepartmentId.value === null || newBlockDepartmentId.value === '')
    return 'Необходимо указать ответственное подразделение'
  return ''
})

function reorderBlock(data: {
  oldIndex: number
  oldList: string
  newIndex: number
  newList: string
}) {
  if (data.newList === data.oldList) {
    const fromItem = questionGroups.value[data.oldIndex]
    const toItem = questionGroups.value[data.newIndex]
    reorderQuestionGroup(toItem.order, fromItem.order)
  }
}

function deleteBlock(data: QuestionGroup) {
  deleteQuestionGroup(data.id)
}

function changeBlock(data: QuestionGroup) {
  changeQuestionGroup(data)
}
</script>
<style lang="scss">
.new-item-form {
  padding: 10px;
  background: white;
  border-radius: 5px;
  margin: 10px 0;
  align-items: flex-end;
}
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
    display: flex;
    gap: 10px;
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
