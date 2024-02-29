import type { Request } from '@/interfaces/request.interface'
import { useLockStore } from '@/store/lock.store'
import { storeToRefs } from 'pinia'
import { computed, onUpdated, ref, type Ref } from 'vue'

export default function useCardAdditional(
  request: Ref<Request | undefined>,
  id: string | string[],
  requestCard: Ref<HTMLElement | undefined>
) {
  const { myId } = storeToRefs(useLockStore())
  const canManageCard = computed(
    () =>
      (!request.value || request.value.userId === myId.value) &&
      (request.value?.stage?.initialStage || !request.value?.stage?.roleId)
  )

  const title = computed(() =>
    canManageCard.value ? (id === 'new' ? 'Создание заяви' : 'Изменение заявки') : 'Просмотр заявки'
  )

  onUpdated(() => {
    if (!requestCard.value) return
    invalidFieldsCount.value = requestCard.value.querySelectorAll('.invalid').length
  })

  const invalidFieldsCount = ref(0)

  return { canManageCard, title, invalidFieldsCount }
}
