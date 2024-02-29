import { baseUrl } from '@/config/baseUrl'
import useHttp from './use-http.composable'
import { ref, type Ref } from 'vue'

export default function useDefaultCrud<
  Entity extends { id: number | string },
  CreateDto = Entity,
  UpdateDto = CreateDto
>(path: string, url: string = baseUrl, silent = false, withLoading = true) {
  const { http } = useHttp(silent, withLoading)
  const collection = ref<Entity[]>([]) as Ref<Entity[]>

  async function getAll() {
    return http.get<Entity[]>(`${url}/${path}`).then(({ data }) => {
      collection.value = data
      return data
    })
  }

  async function getOne(id: number | string) {
    return (await http.get<Entity>(`${url}/${path}/${id}`)).data
  }

  async function create(createDto: CreateDto) {
    return http.post<Entity>(`${url}/${path}`, createDto)
  }

  async function update(id: number | string, updateDto: UpdateDto) {
    return http.patch<Entity>(`${url}/${path}/${id}`, updateDto)
  }

  async function remove(id: number | string) {
    return http.delete<void>(`${url}/${path}/${id}`)
  }

  async function createAndInsert(createDto: CreateDto) {
    return create(createDto).then(({ data }) => {
      collection.value.push(data)
      return collection.value
    })
  }

  async function updateAndReplace(id: number | string, updateDto: UpdateDto) {
    return update(id, updateDto).then(({ data }) => {
      const existIndex = collection.value.findIndex((item) => item.id === id)
      if (existIndex === -1) {
        collection.value.push(data)
      } else {
        collection.value.splice(existIndex, 1, { ...collection.value[existIndex], ...updateDto })
      }
      return collection.value
    })
  }

  async function removeAndSplice(id: number | string) {
    return remove(id).then(() => {
      collection.value.splice(
        collection.value.findIndex((item) => item.id === id),
        1
      )
      return collection.value
    })
  }

  return {
    collection,
    getAll,
    getOne,
    create,
    update,
    remove,
    createAndInsert,
    updateAndReplace,
    removeAndSplice
  }
}
