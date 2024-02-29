import useTprHttp from '@/composables/http/use-tpr-http.composable'
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { useDateFormat } from '@vueuse/core'
import { computed, type ComputedRef, ref, onMounted } from 'vue'

export type TprCardValidationError = { [key in keyof TprStandart]?: string }

export default function useCardValidations(
  row: ComputedRef<TprStandart | null>,
  hasChanges: ComputedRef<boolean>
) {
  const requiredFields: (keyof TprStandart)[] = [
    'customer_Staff_Project',
    'name_CalendarPlan',
    'start_CalendarPlan',
    'finish_CalendarPlan',
    'statusCalendarPlan_None',
    'department_Staff_Project',
    'kindWork_Business_Project',
    'directWork_Business_Project',
    'risk_CalendarPlan',
    'opex_CalendarPlan',
    'genwork_CalendarPlan'
  ]

  const requiredFieldsValidationErrors = computed<TprCardValidationError>(() => {
    const errorObj: TprCardValidationError = {}
    requiredFields.forEach((field) => {
      if (row.value)
        if (
          row.value[field] === undefined ||
          row.value[field] === null ||
          row.value[field] === ''
        ) {
          errorObj[field] = 'Обязательное поле!'
        }
    })
    return errorObj
  })

  const backendChecks = ref<Partial<TprStandart>[]>([])

  const { getTprChecks } = useTprHttp()
  async function getChecks() {
    getTprChecks().then(({ data }) => {
      backendChecks.value = data
    })
  }
  onMounted(() => {
    getChecks()
  })

  const currentRowCheck = computed(() =>
    backendChecks.value.find((check) => check.ID === row.value?.ID)
  )
  const datesValidationErrors = computed(() => {
    const obj: TprCardValidationError = {}
    function getDateTime(dateString: string) {
      return new Date(dateString).getTime()
    }
    if (row.value) {
      if (getDateTime(row.value.start_CalendarPlan) > getDateTime(row.value.finish_CalendarPlan)) {
        obj.start_CalendarPlan = 'Дата начала должны быть меньше даты окончания'
        obj.finish_CalendarPlan = 'Дата окончания должна быть больше даты начала'
      }
      if (
        currentRowCheck.value &&
        currentRowCheck.value.start_CalendarPlan &&
        currentRowCheck.value.finish_CalendarPlan
      ) {
        if (
          getDateTime(row.value.start_CalendarPlan) >
          getDateTime(currentRowCheck.value.start_CalendarPlan)
        )
          obj.start_CalendarPlan = `Дата начала должна быть меньше чем ${
            useDateFormat(currentRowCheck.value.start_CalendarPlan, 'DD.MM.YYYY').value
          }`
        if (row.value.finish_CalendarPlan < currentRowCheck.value.finish_CalendarPlan)
          obj.finish_CalendarPlan = `Дата окончания должна быть больше чем ${
            useDateFormat(currentRowCheck.value.finish_CalendarPlan, 'DD.MM.YYYY').value
          }`
      }
      if (!row.value.genwork_CalendarPlan && row.value.subs && row.value.subs[0]) {
        const gen = row.value.subs[0]
        if (getDateTime(row.value.start_CalendarPlan) < getDateTime(gen.start_CalendarPlan))
          obj.start_CalendarPlan = `Дата начала субподряда должна быть больше чем дата начала генподряда - ${
            useDateFormat(gen.start_CalendarPlan, 'DD.MM.YYYY').value
          }`
        if (getDateTime(row.value.finish_CalendarPlan) > getDateTime(gen.finish_CalendarPlan))
          obj.finish_CalendarPlan = `Дата окончания субподряда должна быть меньше чем дата окончания генподряда - ${
            useDateFormat(gen.finish_CalendarPlan, 'DD.MM.YYYY').value
          }`
      }
    }
    return obj
  })

  const subValidationErrors = computed(() => {
    const obj: TprCardValidationError = {}
    if (row.value && !row.value.genwork_CalendarPlan) {
      if (
        row.value.scopeWorkSubcontract_None === null ||
        row.value.scopeWorkSubcontract_None === undefined ||
        row.value.scopeWorkSubcontract_None === ''
      )
        obj.scopeWorkSubcontract_None = 'Обязательно для субподряда!'
      if (
        row.value.reasonWorkSubcontract_None === null ||
        row.value.reasonWorkSubcontract_None === undefined ||
        row.value.reasonWorkSubcontract_None === ''
      )
        obj.reasonWorkSubcontract_None = 'Обязательно для субподряда!'
    }
    return obj
  })

  const statusCommentValidation = computed(() => {
    const obj: TprCardValidationError = {}
    const statusesForCommentNeeds = [
      'заключается',
      'замена на другой (ие)',
      'не заключен',
      'отменен',
      'перенесен на след год'
    ]
    if (
      row.value &&
      statusesForCommentNeeds.includes(row.value.statusCalendarPlan_None) &&
      (row.value.status_CommentBlock === null ||
        row.value.status_CommentBlock === undefined ||
        row.value.status_CommentBlock === '')
    ) {
      obj.status_CommentBlock = 'Обязательно к заполнению!'
    }
    if (
      row.value &&
      row.value.generalDeviation_None !== 0 &&
      row.value.generalDeviation_None !== null &&
      (row.value.comments_GeneralForcesFactor === null ||
        row.value.comments_GeneralForcesFactor === undefined ||
        row.value.comments_GeneralForcesFactor === '')
    )
      obj.comments_GeneralForcesFactor = 'Укажите комментарий!'
    if (
      row.value &&
      row.value.ownDeviation_None !== 0 &&
      row.value.ownDeviation_None !== null &&
      (row.value.comments_OwnForcesFactor === null ||
        row.value.comments_OwnForcesFactor === undefined ||
        row.value.comments_OwnForcesFactor === '')
    )
      obj.comments_OwnForcesFactor = 'Укажите комментарий!'
    return obj
  })

  const allValidationErrors = computed<TprCardValidationError>(() => ({
    ...requiredFieldsValidationErrors.value,
    ...datesValidationErrors.value,
    ...subValidationErrors.value,
    ...statusCommentValidation.value
  }))

  const canSave = computed(
    () => Object.keys(allValidationErrors.value).length === 0 && hasChanges.value
  )

  return { allValidationErrors, canSave }
}
