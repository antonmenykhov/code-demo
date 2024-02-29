<template>
  <div class="container">
    <h1>Участники опроса</h1>
    <UserManagingComponent
      :employees="employees"
      :users="users"
      left-title="Участники опроса"
      right-title="Могут участвовать"
      @add-user="addUserHandler"
      @delete-user="deleteUserHandler"
    />
  </div>
</template>
<script lang="ts" setup>
import useUsers from '@/composables/use-users.composable'
import useEmployees from '@/composables/use-employees.composable'
import type { Employee } from '@/interfaces/employee.interface'
import UserManagingComponent from '@/components/UserManagingComponent.vue'

const { users, addUser, deleteUser } = useUsers()
const { employees } = useEmployees()

function addUserHandler(data: Employee): void {
  addUser(data.employeeId)
}

function deleteUserHandler(id: number): void {
  deleteUser(id)
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
