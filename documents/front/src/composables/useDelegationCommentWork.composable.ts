import { useUserInfoStore } from '@/stores/userInfoStore'
import { storeToRefs } from 'pinia'
import useDefaultCurd from './useDefaultCrud.composable'
import type {
  DelegationComment,
  DelegationCommentDto
} from '@/interfaces/delegation-comment.interface'

export default function useDelegationCommentWork() {
  const { myId } = storeToRefs(useUserInfoStore())
  const { create: aprooveComment } = useDefaultCurd<DelegationComment, DelegationCommentDto>(
    'delegation-comment/need-aproove'
  )
  const { create: returnComment } = useDefaultCurd<DelegationComment, DelegationCommentDto>(
    'delegation-comment/return'
  )

  async function saveComment(delegationId: number, comment: string, isReturning: boolean) {
    return (isReturning ? returnComment : aprooveComment)({
      fromId: myId.value,
      comment,
      delegationId
    })
  }

  return { saveComment }
}
