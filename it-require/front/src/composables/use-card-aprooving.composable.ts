import type { Request } from '@/interfaces/request.interface'
import { useLockStore } from '@/store/lock.store'
import { storeToRefs } from 'pinia'
import { computed, type Ref } from 'vue'
import useHttp from './use-http.composable'
import { baseUrl } from '@/config/baseUrl'

export default function useCardAprooving(
  request: Ref<Request | undefined>,
  getOneWithAnswersAndForm: (id: string | number) => Promise<Request>
) {
  const { keycloak, serviceName } = storeToRefs(useLockStore())
  const canManageAprooveing = computed(
    () =>
      request.value?.stage &&
      (!request.value.stage.roleId ||
        keycloak.value.tokenParsed?.resource_access?.[serviceName.value]?.roles.includes(
          request.value.stage.roleId
        ))
  )
  const canAproove = computed(
    () => canManageAprooveing.value && (request.value?.stage?.nextStageId ? true : false)
  )
  const canReturn = computed(
    () => canManageAprooveing.value && (request.value?.stage?.previousStageId ? true : false)
  )

  const { http } = useHttp()

  async function setNextStage() {
    if (!request.value) return
    return http.post(`${baseUrl}/request/stage/${request.value.id}`).then(async () => {
      if (!request.value) return
      request.value = await getOneWithAnswersAndForm(request.value.id)
      return
    })
  }

  async function setPreviousStage() {
    if (!request.value) return
    return http.delete(`${baseUrl}/request/stage/${request.value.id}`).then(async () => {
      if (!request.value) return
      request.value = await getOneWithAnswersAndForm(request.value.id)
      return
    })
  }

  return { canAproove, canReturn, setNextStage, setPreviousStage }
}
