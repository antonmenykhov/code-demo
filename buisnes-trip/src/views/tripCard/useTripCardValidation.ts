import { computed, type Ref } from 'vue'
import type { FormInputData } from './useTripCardInOut'

export default function useTripCardValidation(formData: Ref<FormInputData>) {
  const validateMessageCity = computed(() => {
    if (formData.value.cityId === 0 || formData.value.cityId === null)
      return 'Необходимо указать город'
    return ''
  })
  const validateMessagePagePurpouse = computed(() => {
    if (formData.value.tripPurposeId === 0 || formData.value.tripPurposeId === null)
      return 'Необходимо указать цель командировки'
    return ''
  })
  const validateMessageDateStart = computed(() => {
    if (formData.value.dateStart === '' || formData.value.dateStart === null)
      return 'Необходимо указать дату начала'
    return ''
  })
  const validateMessageDateFinish = computed(() => {
    if (formData.value.dateFinish === '' || formData.value.dateFinish === null)
      return 'Необходимо указать дату окончания'
    return ''
  })
  const validateMessageMvz = computed(() => {
    if (formData.value.finStructureId === null) return 'Необходимо указать МВЗ'
    return ''
  })
  const validateMessageDepartment = computed(() => {
    if (formData.value.departmentName === '') return 'Необходимо указать структурное подразделение'
    return ''
  })
  const validateMessageBlock = computed(() => {
    if (formData.value.blockName === '') return 'Необходимо указать блок'
    return ''
  })
  const validateMessageSubDepartment = computed(() => {
    if (formData.value.finStructureId === null)
      return 'Необходимо указать структурное подразделение ШР'
    return ''
  })
  const validateMessageHasTransport = computed(() => {
    if (formData.value.transport.some((trasnsport) => trasnsport.used)) return ''
    return 'Необходимо выбрать хотя бы один вид'
  })
  const isDateValid = computed(() => {
    if (new Date(formData.value.dateStart) > new Date(formData.value.dateFinish)) return false
    if (new Date(formData.value.dateStart) < new Date('2023-12-31T19:00:00.000Z')) return false
    return true
  })

  const hasValidationIssuses = computed(
    () =>
      validateMessageCity.value.length > 0 ||
      validateMessageDateFinish.value.length > 0 ||
      validateMessageDateStart.value.length > 0 ||
      validateMessagePagePurpouse.value.length > 0 ||
      validateMessageDepartment.value.length > 0 ||
      validateMessageMvz.value.length > 0 ||
      validateMessageSubDepartment.value.length > 0 ||
      validateMessageBlock.value.length > 0 ||
      validateMessageHasTransport.value.length > 0 ||
      !isDateValid.value
  )

  return {
    isDateValid,
    validateMessageBlock,
    validateMessageCity,
    validateMessageDateFinish,
    validateMessageDateStart,
    validateMessageHasTransport,
    validateMessageSubDepartment,
    validateMessagePagePurpouse,
    validateMessageMvz,
    validateMessageDepartment,
    hasValidationIssuses
  }
}
