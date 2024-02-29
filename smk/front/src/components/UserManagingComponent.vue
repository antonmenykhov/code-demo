<template>
  <div class="two-tables">
    <div>
      <h3>{{ leftTitle }}</h3>
      <TableComponent
        css-class="stretch-table"
        :columns="columns"
        :rows="usersComputed"
        :allow-edit="false"
        :allow-filter="true"
        :allow-pagination="true"
        :allow-delete="true"
        allow-sorting
        allow-grouping
        allow-fixing
        key-expr="id"
        @delete-row="deleteUserHandler"
      />
    </div>
    <div>
      <h3>{{ rightTitle }}</h3>
      <TableComponent
        css-class="stretch-table"
        :columns="employeesColumns"
        :rows="filteredEmployees"
        :allow-edit="false"
        :allow-filter="true"
        :allow-pagination="true"
        :custom-manage-buttons="customManageButtons"
        allow-sorting
        allow-grouping
        allow-fixing
        key-expr="tabnum"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { User } from '@/interfaces/user.interface'
import { TableComponent, type Column, type EditingDeleteEvent } from 'tnnc-ui-kit'
import type { CustomManageButton } from 'tnnc-ui-kit/dist/components/secondary-components/ManageCell.vue'
import type { Employee } from '@/interfaces/employee.interface'
import type { Responsible } from '@/interfaces/responsible.interface'

const props = defineProps<{
  users: User[] | Responsible[]
  employees: Employee[]
  leftTitle: string
  rightTitle: string
}>()

const emit = defineEmits<{
  (e: 'addUser', data: Employee): void
  (e: 'deleteUser', id: number): void
}>()

const customManageButtons: CustomManageButton[] = [
  {
    icon: 'fa-solid fa-plus',
    fn: addUserHandler,
    title: 'Добавить'
  }
]

const employeesColumns: Column[] = [
  {
    caption: 'Пользователь',
    name: 'fullFio',
    editable: false,
    columnType: 'string'
  },
  {
    caption: 'Почта',
    name: 'email',
    editable: false,
    columnType: 'string'
  },
  {
    caption: 'Табельный номер',
    name: 'tabnum',
    editable: false,
    columnType: 'string'
  }
]

const columns = computed(() => {
  const cols: Column[] = [
    {
      caption: 'Пользователь',
      name: 'userId',
      editable: false,
      columnType: 'enum',
      lookup: {
        handbook: props.employees,
        displayExpr: 'fullFio',
        valueExpr: 'employeeId',
        idExpr: 'employeeId'
      }
    },
    {
      caption: 'Почта',
      name: 'userEmail',
      editable: false,
      columnType: 'string'
    },
    {
      caption: 'Табельный номер',
      name: 'tabNumber',
      editable: false,
      columnType: 'string'
    }
  ]
  return cols
})

const usersComputed = computed(() => {
  return props.users.map((user) => {
    const newUser = { ...user }
    const fullFio = props.employees.find((emp) => emp.employeeId === user.userId)
    if (fullFio) {
      newUser.userEmail = fullFio.email
      newUser.tabNumber = fullFio.tabnum
    }
    return newUser
  })
})

const filteredEmployees = computed(() =>
  props.employees.filter(
    (emp) => !usersComputed.value.find((user) => user.tabNumber === emp.tabnum)
  )
)

function addUserHandler(data: Employee): void {
  emit('addUser', props.employees.find((emp) => emp.tabnum === data.tabnum) as Employee)
}

function deleteUserHandler(data: EditingDeleteEvent<User | Responsible>): void {
  emit('deleteUser', data.row.id)
}
</script>
<style lang="scss">
.two-tables {
  display: flex;
  gap: 10px;
  overflow: hidden;
  & > div {
    flex: 1;
    overflow: hidden;
    .stretch-table {
      height: calc(100vh - 155px);
    }
  }
}
</style>
