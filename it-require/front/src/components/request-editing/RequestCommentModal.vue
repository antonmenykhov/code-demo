<template>
  <PopupComponent v-model:visible="isPopupOpened" :title="title" close-on-outside-click>
    <TextAreaInput
      v-if="requestComment"
      label="Текст комментария"
      v-model:value="requestComment.comment"
    />
    <ButtonComponent text="Сохранить" @click="saveComment" />
  </PopupComponent>
</template>
<script lang="ts" setup>
import type { RequestComment } from '@/interfaces/request.interface'
import { ButtonComponent, PopupComponent, TextAreaInput } from '@tnnc/tnnc-ui-kit'
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'saveComment', data: RequestComment): void
}>()
const isPopupOpened = ref(false)
const requestComment = ref<RequestComment>()

const title = computed(() =>
  requestComment.value?.id === 0 ? 'Создание комментария' : 'Редактирование комментария'
)

function openPopup(request: RequestComment) {
  requestComment.value = request
  isPopupOpened.value = true
}

function saveComment() {
  if (!requestComment.value) return
  emit('saveComment', requestComment.value)
  isPopupOpened.value = false
}

defineExpose({ openPopup })
</script>
