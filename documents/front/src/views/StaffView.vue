<template>
  <div class="users-view">
    <TableComponent
      :rows="collectionWithMappedRoles"
      :columns="isMobile ? columns.slice(0, 1) : columns"
      :hide-action-buttons="!isInitier"
      :hide-add-button="!isInitier"
      table-name="user-table"
      @create="createHandler"
      @update="updateHandler"
      @delete="deleteHandler"
    />
    <UserCard
      v-if="userForEditing"
      :user="userForEditing"
      v-model:opened="cardOpened"
      :loading="cardLoading"
      :roles="roles"
      :title="cardTitle"
      :signForUser="signForUser"
      :userInfo="userInfo"
      @save="saveHandler"
      @sign-attachment-updated="saveUseSignHandler"
    />
  </div>
</template>
<script lang="ts" setup>
import TableComponent, { type TableColumn } from '@/components/TableComponent.vue'
import UserCard from '@/components/UserCard.vue'
import useDefaultCurd from '@/composables/useDefaultCrud.composable'
import useHttp from '@/composables/useHttp.composable'
import type { Attachment } from '@/interfaces/attachment.interface'
import type { Role } from '@/interfaces/role.interface'
import type { UserSign } from '@/interfaces/user-sign.interface'
import type { User, UserInfo } from '@/interfaces/user.interface'
import { useModeStore } from '@/stores/modeStore'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

export type CreateUserDto = {
  email: string
  password: string
  name: string
  position: string
  phone: string
}

const { isMobile } = storeToRefs(useModeStore())
const { isInitier } = storeToRefs(useUserInfoStore())
const { http } = useHttp()
const { collection, getAll, createAndInsert, updateAndReplace, removeAndSplice } = useDefaultCurd<
  User,
  CreateUserDto,
  Partial<CreateUserDto>
>('User')

const {
  collection: userInfoCollection,
  getAll: getAllUserInfo,
  createAndInsert: createUserInfo,
  updateAndReplace: updateUserInfo
} = useDefaultCurd<UserInfo, Omit<UserInfo, 'id'>>('user-info')
getAllUserInfo()

async function addRole(userId: string, roles: Role[]) {
  return http.post('/role/add', { userId, roles })
}
async function removeRole(userId: string, roles: Role[]) {
  return http.post('/role/remove', { userId, roles })
}

const { collection: roles, getAll: getRoles } = useDefaultCurd<Role>('role')
const {
  createAndInsert: createAndInsertUserSign,
  updateAndReplace: updateAndReplaceSign,
  collection: allSigns,
  getAll: getAllSigns
} = useDefaultCurd<UserSign, Omit<UserSign, 'id'>, Omit<UserSign, 'id' | 'userId'>>('user-sign')

getAllSigns()

async function saveUseSignHandler(data: {
  newAttachment: Attachment
  sign?: UserSign
  userId: string
}) {
  if (data.sign) {
    await updateAndReplaceSign(data.sign.id, {
      attachmentId: data.newAttachment.id
    })
  } else {
    await createAndInsertUserSign({ attachmentId: data.newAttachment.id, userId: data.userId })
  }
}

const collectionWithMappedRoles = computed(() =>
  collection.value.map((collection) => ({
    ...collection,
    rolesString: collection.clientRoles?.documents
      ?.map(
        (roleName: string) => roles.value.find((role) => role.name === roleName)?.description || ''
      )
      .join(', ')
  }))
)

const columns: TableColumn[] = [
  {
    name: 'lastName',
    caption: 'ФИО сотрудника'
  },
  {
    name: 'firstName',
    caption: 'Должность сотрудника'
  },
  {
    name: 'username',
    caption: 'Телефон для связи'
  },
  {
    name: 'email',
    caption: 'Адрес электронной почты'
  },
  {
    name: 'rolesString',
    caption: 'Роли пользователя'
  }
]
const userForEditing = ref<User | undefined>()
const signForUser = computed(() =>
  allSigns.value.find((sign) => sign.userId === userForEditing.value?.id)
)
const userInfo = computed(() =>
  userInfoCollection.value.find((info) => info.userId === userForEditing.value?.id)
)
const cardOpened = ref(false)
const cardTitle = computed(() =>
  userForEditing.value?.id === '' ? 'Добавление пользователя' : 'Редактирование пользователя'
)
const cardLoading = ref(false)
function createHandler() {
  userForEditing.value = {
    id: '',
    createdTimestamp: 1,
    username: '',
    enabled: true,
    totp: true,
    emailVerified: true,
    disableableCredentialTypes: [],
    notBefore: 1,
    access: {},
    attributes: {},
    clientRoles: { documents: [] },
    email: '',
    federationLink: '',
    firstName: '',
    groups: [],
    lastName: '',
    origin: '',
    realmRoles: [],
    self: '',
    serviceAccountClientId: '',
    password: ''
  }
  cardOpened.value = true
}
async function saveHandler(data: { changedUser: User; userInfo: UserInfo }) {
  let { changedUser, userInfo } = data
  const rolesForDeleting: string[] =
    userForEditing.value?.clientRoles?.documents?.filter(
      (role: string) => !changedUser.clientRoles.documents.includes(role)
    ) || []
  const rolesForAdding: string[] =
    changedUser.clientRoles?.documents?.filter(
      (role: string) => !userForEditing.value?.clientRoles?.documents?.includes(role)
    ) || []
  if (changedUser.id === '') {
    changedUser = await createAndInsert({
      name: changedUser.lastName,
      phone: changedUser.username,
      email: changedUser.email,
      password: changedUser.password,
      position: changedUser.firstName
    })
  }
  if (rolesForDeleting.length)
    await removeRole(
      changedUser.id,
      rolesForDeleting.map((roleName) => roles.value.find((role) => role.name === roleName) as Role)
    )
  if (rolesForAdding.length)
    await addRole(
      changedUser.id,
      rolesForAdding.map((roleName) => roles.value.find((role) => role.name === roleName) as Role)
    )
  await updateAndReplace(changedUser.id, {
    name: changedUser.lastName,
    phone: changedUser.username,
    email: changedUser.email,
    password: changedUser.password === '__null__' ? undefined : changedUser.password,
    position: changedUser.firstName
  })
  await saveUserInfo(changedUser, userInfo)
  message.success('Пользователь сохранен')
  getAllSigns()
  userForEditing.value = changedUser
}

async function saveUserInfo(user: User, userInfo: UserInfo) {
  if (userInfo.id === 0) {
    return await createUserInfo({ userId: user.id, email: userInfo.email })
  } else {
    return await updateUserInfo(userInfo.id, { userId: user.id, email: userInfo.email })
  }
}

function updateHandler(User: User) {
  userForEditing.value = User
  cardOpened.value = true
}
async function deleteHandler(id: number) {
  removeAndSplice(id).then(() => {
    message.success('Пользователь удален')
  })
}
getAll()
getRoles()
</script>
<style lang="scss">
.users-view {
  height: 100%;
  & > * {
    height: 100%;
  }
}
</style>
