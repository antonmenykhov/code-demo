<template>
  <div class="container">
    <HandbookTable
      multiply-name="users"
      name="user"
      :can-edit="true"
      :row-prepare-function="prepareUserRow"
    />
  </div>
</template>
<script lang="ts" setup>
import HandbookTable from '@/components/HandbookTable.vue'
import type { EditigngSaveEvent } from '@tnnc/tnnc-ui-kit'
import { handbooksStore } from '@/store/hanbooks.store'
import type { User } from '@/interfaces/user.inteface'
import type { HandbookItem } from '../handbooks/useHandbooks.composable'

const store = handbooksStore()

function prepareUserRow(e: EditigngSaveEvent<HandbookItem>) {
  const newUser: User = { ...(e.row as User) }
  const employee = store.employees.find((emp) => emp.userId === newUser.sr_id)
  if (employee) {
    newUser.fio = employee.fullFio
    newUser.username = employee.login
    return newUser
  }
  return newUser
}
</script>
