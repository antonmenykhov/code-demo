import baseUrl from '@/config/baseUrl'
import type { User } from '@/interfaces/user.interface'
import type { AxiosInstance } from 'axios'
import { type Ref, ref, inject } from 'vue'

export default function useUsers() {
  const http = inject('http') as AxiosInstance
  const users: Ref<User[]> = ref([])

  async function getUsers() {
    http
      .get(`${baseUrl.baseUrl}/users`)
      .then(({ data }) => {
        users.value = data
      })
      .catch(() => {
        users.value = []
      })
  }

  async function addUser(userId: string) {
    http
      .post(`${baseUrl.baseUrl}/users/`, {
        userId: userId
      })
      .then(() => {
        getUsers()
      })
      .catch(() => {
        users.value = [...users.value]
      })
  }

  async function deleteUser(id: number) {
    http.delete(`${baseUrl.baseUrl}/users/${id}`).then(() => {
      const index = users.value.findIndex((user) => user.id === id)
      if (index !== -1) users.value.splice(index, 1)
    })
  }

  getUsers()

  return { users, getUsers, addUser, deleteUser }
}
