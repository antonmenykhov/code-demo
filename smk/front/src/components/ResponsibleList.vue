<template>
  <div class="responsible-list-wrapper">
    <h4>Ответственные сотрудники</h4>
    <div class="responsible-list">
      <div class="current-list">
        <ul>
          <li v-for="responsible in computedResponsibles" :key="responsible.userId">
            {{ responsible.userName }}
          </li>
        </ul>
        <div v-if="questionGroup.responsibles.length === 0">Ответственных нет</div>
      </div>
      <ButtonComponent
        text="Изменить ответственных"
        icon-class="fa-solid fa-user"
        reverse
        type="default"
        @click="
          () => {
            popupVisible = true
            columnResizeTrigger()
          }
        "
      />
    </div>
    <PopupComponent
      :title="`Ответственные за ${questionGroup.name}`"
      height="90vh"
      width="75vw"
      v-model:visible="popupVisible"
    >
      <div class="responsible-list-wrapper">
        <UserManagingComponent
          :employees="employees"
          :users="questionGroup.responsibles"
          left-title="Ответственные"
          right-title="Можно назначить"
          @add-user="addResponsibleHandler"
          @delete-user="removeResponsibleHandler"
        />
      </div>
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import type { Employee } from '@/interfaces/employee.interface'
import type { QuestionGroup } from '@/interfaces/question-group.interface'
import { ButtonComponent, PopupComponent } from 'tnnc-ui-kit'
import { ref, computed } from 'vue'
import UserManagingComponent from './UserManagingComponent.vue'
import useResponsible from '@/composables/use-responsible.composable'

const props = defineProps<{
  questionGroup: QuestionGroup
  employees: Employee[]
}>()

const computedResponsibles = computed(() =>
  props.questionGroup.responsibles.map((res) => {
    const newRes = { ...res }
    const fullInfo = props.employees.find((emp) => emp.employeeId === newRes.userId)
    if (fullInfo) newRes.userName = fullInfo?.fullFio
    return newRes
  })
)

const emit = defineEmits<{ (e: 'update:questionGroup', data: QuestionGroup): void }>()

const popupVisible = ref(false)

const { addResponsible, removeResponible } = useResponsible(props.questionGroup.id)

function addResponsibleHandler(emp: Employee) {
  addResponsible(emp.employeeId).then(({ data }) => {
    emit('update:questionGroup', {
      ...props.questionGroup,
      responsibles: [...props.questionGroup.responsibles, data]
    })
  })
}
function removeResponsibleHandler(id: number) {
  removeResponible(id).then(() => {
    const newResponsibles = [...props.questionGroup.responsibles]
    const index = newResponsibles.findIndex((res) => res.id === id)
    if (index !== -1) newResponsibles.splice(index, 1)
    emit('update:questionGroup', { ...props.questionGroup, responsibles: newResponsibles })
  })
}

function columnResizeTrigger() {
  setTimeout(() => {
    window.scrollTo(window.scrollX + 1, window.scrollY + 2)
    window.scrollTo(window.scrollX + 1, window.scrollY - 2)
  }, 300)
}
</script>
<style lang="scss">
.responsible-list {
  display: flex;
  justify-content: space-between;
  background: white;
  border-radius: 5px;
  align-items: flex-start;
  padding: 10px;
  ul {
    padding-left: 20px;
  }
}
.responsible-list-wrapper {
  background: #ececec;
  padding: 5px;
  border-radius: 5px;
  margin-top: 10px;
  z-index: 5;
  overflow: hidden;
  .stretch-table {
    height: calc(90vh - 150px) !important;
  }
}
</style>
