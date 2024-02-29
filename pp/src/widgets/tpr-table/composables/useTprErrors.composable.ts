import useTprHttp from '@/composables/http/use-tpr-http.composable'
import type { TprError } from '@/interfaces/supp-entities/tpr-error.interface'
import { ref, type Ref } from 'vue'

export default function useTprErrors(year: Ref<number>) {
  const { getTprErrors } = useTprHttp()
  const errors = ref<TprError[]>([])
  async function getErrors(ids?: number[]) {
    return getTprErrors(year.value, ids)
  }

  async function getAllErrors() {
    return getErrors().then(({ data }) => {
      errors.value = data.sort((a, b) => a.ID - b.ID)
    })
  }

  return { errors, getErrors, getAllErrors }
}
