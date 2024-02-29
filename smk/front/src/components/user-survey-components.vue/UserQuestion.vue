<template>
  <div class="question" :class="[cssClass]">
    <h4>{{ question.text }}</h4>
    <RadioGroup
      :group-name="question.text"
      :options="variants"
      :value="currentAnswer"
      :group-css-class="groupCssClass"
      radio-button-css-class="variant"
      @update:value="setVariant"
    />
    <TextAreaInput
      css-class="answer-comment"
      :value="comment"
      :rows="2"
      placeholder="Введите комментарий"
      :invalid="alertMessageText.length > 0"
      :invalid-text="alertMessageText"
      @update:value="setComment"
    />
  </div>
</template>
<script lang="ts" setup>
import type { Question } from '@/interfaces/question.interface'
import { computed, inject } from 'vue'
import { RadioGroup, TextAreaInput } from 'tnnc-ui-kit'

const props = defineProps<{
  question: Question
  alertMessageText: string
  questionIndex: number
  disableZeroAnswers: boolean
  cssClass?: string
}>()
const variants = computed(() => {
  let variants: {
    label: string
    value: string
    disabled?: boolean | undefined
  }[] = []
  for (let i = props.disableZeroAnswers ? 1 : 0; i <= 10; i++) {
    variants.push({
      label: `${i}`,
      value: `${i}`
    })
  }

  return variants
})

const currentAnswer = computed(() => {
  const { question } = props
  if (question.answers && question.answers.length > 0) {
    const answer = question.answers[0]
    return `${answer.numericVariant}`
  }

  return ''
})
const groupCssClass = computed(() => {
  return 'question-variants ' + 'numeric-variants'
})
const comment = computed(() => props.question.answers?.[0]?.comment || '')
const setAnswerInjected = inject('setAnswer') as (variant: number, questionIndex: number) => void
const setCommentInjected = inject('setComment') as (variant: string, questionIndex: number) => void
function setVariant(variant: string) {
  const numericVariant = +variant
  setAnswerInjected(numericVariant, props.questionIndex)
}
function setComment(comment: string | number) {
  setCommentInjected(`${comment}`, props.questionIndex)
}
</script>
<style lang="scss">
.question-variants {
  display: flex;
  justify-content: center;
  flex-direction: row;
  margin: 20px 0;
}
.numeric-variants {
  flex-direction: row;
  display: flex;
  gap: 5px;
  transform: scale(0.7);
  .variant {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    padding: 3px;
    border-radius: 20px;
    opacity: 0.7;
    &.checked {
      opacity: 1;
    }
    &.tnnc-radio-button input[type='radio'] {
      border: 2px solid white;
    }
    &.tnnc-radio-button input[type='radio']:checked {
      background: white;
    }
    label {
      padding: 5px 0;
      font-weight: 500;
      font-size: 18px;
      width: 100%;
      text-align: center;
    }
    &:hover {
      box-shadow: 0 0 1px #aeaeae;
      opacity: 0.9;
    }
    &:nth-child(1) {
      background: #7c90a4;
    }
    &:nth-child(2) {
      background: #f07266;
    }
    &:nth-child(3) {
      background: #f07266;
    }
    &:nth-child(4) {
      background: #f07266;
    }
    &:nth-child(5) {
      background: #f07266;
    }
    &:nth-child(6) {
      background: #f07266;
    }
    &:nth-child(7) {
      background: #f0dc54;
    }
    &:nth-child(8) {
      background: #f0dc54;
    }
    &:nth-child(9) {
      background: #85d372;
    }
    &:nth-child(10) {
      background: #74cf75;
    }
    &:nth-child(11) {
      background: #74cf75;
    }
  }
}
.answer-comment {
  margin-top: 10px;
}
.question {
  transition: all 0.3s ease-in-out;
  h4 {
    padding: 0 10px;
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
  }
  .hide {
    opacity: 0;
  }
}
.string-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 700px;
  margin: 40px auto;
  .variant {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    background: white;
    padding: 3px;
    border-radius: 20px;
    flex: 1 1 300px;
    label {
      margin-left: 10px;
      flex: 1;
    }
    &:hover {
      box-shadow: 0 0 1px #aeaeae;
    }
  }
}
</style>
