<template>
  <div class="question-element" :style="`margin-left: ${level * 20}px`">
    <div class="question-info">
      <div class="title">
        <ButtonComponent
          v-if="childOrdered.length"
          icon-class="fa-solid fa-chevron-right"
          :css-class="'collapse-button ' + (isChildVisible ? 'opened' : '')"
          @click="() => (isChildVisible = !isChildVisible)"
        />
        <div class="name">{{ childNumber }} {{ level === 0 ? 'Вопросы' : question.text }}</div>
      </div>
      <div class="buttons">
        <ButtonComponent icon-class="fa-solid fa-add" @click="openCardWithNewQuestion" />
        <ButtonComponent
          v-if="level !== 0"
          icon-class="fa-solid fa-pen"
          @click="openCardWithCurrentQuestion"
        />
        <ButtonComponent
          v-if="level !== 0"
          icon-class="fa-solid fa-trash"
          type="danger"
          @click="removeQuestion"
        />
      </div>
    </div>
    <div class="question-childs" ref="childs">
      <QuestionElement
        v-for="(child, index) in childOrdered"
        :key="child.id"
        :question="child"
        :level="level + 1"
        :child-number="level === 0 ? `${index + 1}` : `${childNumber}.${index + 1}`"
        @open-question-card="(data) => emit('openQuestionCard', data)"
        @delete-question="(data) => emit('deleteQuestion', data)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Question } from '@/interfaces/question.interface'
import { ButtonComponent } from '@tnnc/tnnc-ui-kit'
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    question: Question
    level?: number
    childNumber?: string
    parentId?: number
  }>(),
  {
    level: 0,
    childNumber: ''
  }
)

const emit = defineEmits<{
  (
    e: 'openQuestionCard',
    data: { question: Question; parentId?: number; childNumber: string }
  ): void
  (e: 'deleteQuestion', data: { question: Question; parentId?: number; childNumber: string }): void
}>()

const childOrdered = computed(() =>
  [...(props.question.children || [])].sort((a, b) => a.id - b.id)
)

const isChildVisible = ref(true)

function openCardWithNewQuestion() {
  emit('openQuestionCard', {
    question: {
      id: 0,
      handbookId: null,
      conditionParentValue: null,
      isGroup: false,
      text: '',
      type: 'string',
      order: +(props.childNumber.split('.').reverse()[0] || 0) + 1,
      isRequired: false,
      description: ''
    },
    parentId: props.question.id,
    childNumber: props.childNumber
  })
}
function openCardWithCurrentQuestion() {
  emit('openQuestionCard', {
    question: props.question,
    parentId: props.parentId,
    childNumber: props.childNumber
  })
}
function removeQuestion() {
  emit('deleteQuestion', {
    question: props.question,
    parentId: props.parentId,
    childNumber: props.childNumber
  })
}

const childs = ref<HTMLDivElement>()
watch(isChildVisible, (newVal) => {
  if (!childs.value) return
  if (newVal) {
    childs.value.style.height = `${childs.value.scrollHeight + 10}px`
    childs.value.style.opacity = '1'
    setTimeout(() => {
      if (!childs.value) return
      childs.value.style.height = 'auto'
    }, 200)
  } else {
    childs.value.style.height = `${childs.value.scrollHeight + 10}px`
    setTimeout(() => {
      if (!childs.value) return
      childs.value.style.height = '0px'
      childs.value.style.opacity = '0'
    })
  }
})
</script>
<style lang="scss">
.question-element {
  .tnnc-button {
    padding: 2px;
    i {
      font-size: 13px;
    }
  }
  .question-info {
    display: flex;
    justify-content: space-between;
    gap: 5px;
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 2px 0 #e2e2e2;
    padding: 5px;
    margin-bottom: 10px;
  }
  .buttons,
  .title {
    display: flex;
    gap: 5px;
    align-items: center;
  }
}
.collapse-button.opened {
  transform: rotate(90deg);
}
.question-childs {
  transition: all 0.2s;
}
</style>
