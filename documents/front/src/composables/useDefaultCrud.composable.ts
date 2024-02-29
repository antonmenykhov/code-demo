import { ref, type Ref } from 'vue'
import useHttp from './useHttp.composable'

export default function useDefaultCurd<
  Entity extends { id: number | string },
  CreateEntityDto = any,
  UpdateEntityDto = CreateEntityDto
>(entityName: string) {
  const collection = ref<Entity[]>([]) as Ref<Entity[]>
  const { http } = useHttp()

  async function getAll() {
    return http.get<Entity[]>(`/${entityName}`).then(({ data }) => (collection.value = data))
  }

  async function getOne(id: number | string) {
    return (await http.get<Entity>(`/${entityName}/${id}`)).data
  }

  async function create(createEntityDto: CreateEntityDto) {
    return http.post<Entity>(`/${entityName}`, createEntityDto)
  }

  async function update(id: number | string, updateEntityDto: UpdateEntityDto) {
    return http.patch(`/${entityName}/${id}`, updateEntityDto)
  }

  async function remove(id: number | string) {
    return http.delete(`/${entityName}/${id}`)
  }

  async function createAndInsert(createEntityDto: CreateEntityDto) {
    return create(createEntityDto).then(({ data }) => {
      collection.value.push(data)
      return data
    })
  }

  async function updateAndReplace(id: string | number, updateEntityDto: UpdateEntityDto) {
    return update(id, updateEntityDto).then(async () => {
      const newItem = await getOne(id)
      const index = collection.value.findIndex((item) => item.id === newItem.id)
      if (index !== -1) collection.value.splice(index, 1, newItem)
      return newItem
    })
  }

  async function removeAndSplice(id: number | string) {
    remove(id).then(() => {
      const index = collection.value.findIndex((item) => item.id === id)
      if (index !== -1) collection.value.splice(index, 1)
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
