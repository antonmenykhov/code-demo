<template>
  <div class="contractors-view">
    <TableComponent
      :rows="collection"
      :columns="columns"
      :hide-action-buttons="!isInitier"
      :hide-add-button="!isInitier"
      table-name="contractors-table"
      @create="createHandler"
      @update="updateHandler"
      @delete="deleteHandler"
    />
    <EmailCard ref="emailCard" :loading="cardLoading" @save="saveEmailHandler"></EmailCard>
  </div>
</template>
<script lang="ts" setup>
import EmailCard from '@/components/EmailCard.vue'
import TableComponent, { type TableColumn } from '@/components/TableComponent.vue'
import useDefaultCurd from '@/composables/useDefaultCrud.composable'
import type { Email } from '@/interfaces/email.interface'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { isInitier } = storeToRefs(useUserInfoStore())

const { createAndInsert, updateAndReplace, removeAndSplice, getAll, collection } = useDefaultCurd<
  Email,
  Omit<Email, 'id'>,
  Omit<Email, 'id' | 'password'> & { password?: string }
>('email')

const columns: TableColumn[] = [
  {
    name: 'login',
    caption: 'Логин'
  }
]

const cardLoading = ref(false)
const emailCard = ref<InstanceType<typeof EmailCard>>()
function createHandler() {
  if (emailCard.value) {
    emailCard.value.openCard({ id: 0, host: '', port: 0, password: '', login: '' })
  }
}

async function saveEmailHandler(changedEmail: Email) {
  const { id, host, password, port, login } = changedEmail
  if (id === 0) {
    createAndInsert({ host, password, port, login })
  } else {
    updateAndReplace(id, { host, port, login, password: password || undefined })
  }
}
function updateHandler(email: Email) {
  if (emailCard.value) {
    emailCard.value.openCard(email)
  }
}

function deleteHandler(id: number) {
  removeAndSplice(id)
}

getAll()
</script>
<style lang="scss">
.contractors-view {
  height: 100%;
  & > * {
    height: 100%;
  }
}
</style>
