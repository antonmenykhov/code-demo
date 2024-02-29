import { computed, inject, type ComputedRef, type Ref } from 'vue'
import type { TprCardValidationError } from './useCardValidations.composable'

export default function useCardFieldsInElement(element: Ref<HTMLElement | undefined>) {
  const allValidationErrors = inject('allValidationErrors') as ComputedRef<TprCardValidationError>
  const fieldsInBlock = computed<string[]>(() => {
    if (element.value) {
      const fields = []
      const items = element.value.getElementsByClassName('card-input')
      for (let i = 0; i < items.length; i++) {
        fields.push(`${(items[i] as HTMLElement).dataset['field']}`)
      }
      return fields
    }
    return []
  })

  const hasFieldsWithErrors = computed(() =>
    Object.keys(allValidationErrors.value).some((key) => fieldsInBlock.value.includes(key))
  )

  return { fieldsInBlock, hasFieldsWithErrors }
}
