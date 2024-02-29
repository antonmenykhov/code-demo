<template>
  <div class="comment">
    <div class="user">{{ userName }}</div>
    <div class="text">
      {{ comment.comment.trim() }}
    </div>
    <div class="buttons" v-if="comment.userId === myId">
      <ButtonComponent icon-class="fa-solid fa-pen" @click="openCommentCard" />
      <ButtonComponent icon-class="fa-solid fa-trash" type="danger" @click="deleteComment" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { RequestComment } from '@/interfaces/request.interface'
import { useHandbookStore } from '@/store/handbook.store'
import { useLockStore } from '@/store/lock.store'
import { storeToRefs } from 'pinia'
import { ButtonComponent } from '@tnnc/tnnc-ui-kit'
import { computed, inject } from 'vue'

const { myId } = storeToRefs(useLockStore())
const props = defineProps<{
  comment: RequestComment
}>()

const { users } = storeToRefs(useHandbookStore())
const userName = computed(
  () => users.value.find((user) => user.id === props.comment.userId)?.lastName || ''
)

const openCommentCardInjected = inject<(comment: RequestComment) => void>('openCommentCard')
function openCommentCard() {
  if (openCommentCardInjected) openCommentCardInjected(props.comment)
}

const deleteCommentInjected = inject<(comment: RequestComment) => void>('deleteComment')
function deleteComment() {
  if (deleteCommentInjected) {
    deleteCommentInjected(props.comment)
  }
}
</script>
<style lang="scss">
.comment {
  background: white;
  padding: 5px;
  border-radius: 5px;
  .user {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
  }
  .text {
    color: var(--tnnc-add-color-gray-2);
    white-space: pre;
  }
  .buttons {
    display: flex;
    gap: 3px;
    position: absolute;
    right: 2px;
    top: 2px;
    .tnnc-button {
      padding: 0px;
      i {
        font-size: 10px;
      }
    }
  }
}
</style>
