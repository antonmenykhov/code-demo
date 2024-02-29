import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import { computed, ref, type ComputedRef } from 'vue'
import type { TprCardValidationError } from './useCardValidations.composable'

export default function useCardFieldStyling(row: ComputedRef<TprStandart | null>) {
  const deviationFields = computed(() => {
    const obj: TprCardValidationError = {}
    if (row.value) {
      if (row.value.generalDeviation_None > 0) obj.generalDeviation_None = 'tpr-card-green'
      if (row.value.ownDeviation_None > 0) obj.ownDeviation_None = 'tpr-card-green'
      if (row.value.generalDeviation_None < 0) obj.generalDeviation_None = 'tpr-card-red'
      if (row.value.ownDeviation_None < 0) obj.ownDeviation_None = 'tpr-card-red'
      Object.keys(row.value).forEach((key) => {
        if (
          key.includes('prognozbp') &&
          row.value &&
          Number(row.value[key as keyof TprStandart]) < 0
        ) {
          obj[key as keyof TprStandart] = 'tpr-card-red'
        }
      })
      if (
        (row.value.generalEprognozbp_None !== 0 || row.value.subEprognozbp_None !== 0) &&
        (row.value.deviationPlan_CommentBlock === '' ||
          row.value.deviationPlan_CommentBlock === null ||
          row.value.deviationPlan_CommentBlock === undefined)
      )
        obj.deviationPlan_CommentBlock = 'tpr-card-red'

      if (
        (row.value.generalEprice_Stage - row.value.generalEplanCp_None !== 0 ||
          row.value.subEprice_Stage - row.value.subEplanCp_None !== 0) &&
        (row.value.deviationContract_CommentBlock === '' ||
          row.value.deviationContract_CommentBlock === null ||
          row.value.deviationContract_CommentBlock === undefined)
      )
        obj.deviationContract_CommentBlock = 'tpr-card-red'
    }
    return obj
  })

  const manualHilightedFields = ref(new Set<keyof TprStandart>())
  const manualHilightedFiledsObject = computed(() => {
    const obj: TprCardValidationError = {}
    manualHilightedFields.value.forEach((filed) => {
      obj[filed] = 'tpr-manual-hilight'
    })
    return obj
  })
  const fieldsClasses = computed<TprCardValidationError>(() => ({
    ...deviationFields.value,
    ...manualHilightedFiledsObject.value
  }))

  return { fieldsClasses, manualHilightedFields }
}
