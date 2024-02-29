import type { ContractorDirector } from '@/interfaces/contractor-director.interface'
import type { Contractor } from '@/interfaces/contractor.interface'
import type { AxiosResponse } from 'axios'
import useDefaultCurd from './useDefaultCrud.composable'
import { message } from 'ant-design-vue'

export default function useContractors() {
  const { create, update, remove } = useDefaultCurd<
    ContractorDirector,
    Omit<ContractorDirector, 'id'>
  >('contractor-director')
  const { collection, getAll, createAndInsert, updateAndReplace, removeAndSplice } = useDefaultCurd<
    Contractor,
    Partial<Contractor> & { id: undefined; documents: undefined; directors: undefined }
  >('contractor')
  function createNewContractorMock() {
    return {
      id: 0,
      name: '',
      address: '',
      reqisits: '',
      email: '',
      shortName: '',
      documents: [],
      directors: [
        {
          id: 0,
          contractorId: 0,
          name: '',
          formStaffName: 'Директору',
          formFullName: ''
        }
      ]
    }
  }

  async function manageDirectors(
    changedContractor: Contractor,
    contractorId: number,
    contractorForEditing: Contractor
  ) {
    const promisesList: Promise<AxiosResponse>[] = []
    const directorsForDelete = contractorForEditing.directors.filter(
      (director) =>
        !changedContractor.directors.some((newDirector) => director.id === newDirector.id)
    )
    const directorsForCreate = changedContractor.directors.filter((director) => director.id === 0)
    const directorsForUpdate = changedContractor.directors.filter((director) => director.id !== 0)

    promisesList.push(...directorsForDelete.map((director) => remove(director.id)))
    promisesList.push(
      ...directorsForUpdate.map((director) =>
        update(director.id, {
          contractorId,
          name: director.name,
          formStaffName: director.formStaffName,
          formFullName: director.formFullName
        })
      )
    )
    promisesList.push(
      ...directorsForCreate.map((director) =>
        create({
          contractorId,
          name: director.name,
          formStaffName: director.formStaffName,
          formFullName: director.formFullName
        })
      )
    )

    return Promise.all(promisesList)
  }

  async function saveHandler(changedContractor: Contractor, contractorForEditing: Contractor) {
    let newContractor: Contractor = changedContractor
    if (changedContractor.id === 0) {
      newContractor = await createAndInsert({
        ...changedContractor,
        id: undefined,
        documents: undefined,
        directors: undefined
      })
    }
    await manageDirectors(changedContractor, newContractor.id, contractorForEditing)
    newContractor = await updateAndReplace(newContractor.id, {
      ...newContractor,
      id: undefined,
      documents: undefined,
      directors: undefined
    })
    message.success('Контрагент сохранен')
    return newContractor
  }

  async function deleteHandler(id: number) {
    return removeAndSplice(id).then(() => {
      message.success('Контрагент удален')
    })
  }

  return { collection, getAll, saveHandler, deleteHandler, createNewContractorMock }
}
