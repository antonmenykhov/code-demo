<template>
  <div class="question-group">
    <div class="group-title">
      <h3>{{ questionGroup.name }}</h3>
      <h3 class="counter">Блок {{ currentGroupIndex + 1 }}/{{ groupLength }}</h3>
    </div>

    <div class="question-list">
      <UserQuestion
        v-for="(question, questionIndex) in questionGroup.questions"
        :question="question"
        :question-index="questionIndex"
        :key="question.id"
        :alert-message-text="alertMessageArray[questionIndex]"
        :disable-zero-answers="questionGroup.disableZeroAnswers"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { QuestionGroup } from '@/interfaces/question-group.interface'
import UserQuestion from './UserQuestion.vue'

const props = defineProps<{
  questionGroup: QuestionGroup
  currentGroupIndex: number
  groupLength: number
  alertMessageArray: string[]
}>()
</script>
<style lang="scss">
.question-group {
  overflow: hidden;
  .group-title {
    background: var(--tnnc-color-orange);
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      min-width: 120px;
      margin: 0;
      text-align: right;
      text-transform: uppercase;
      font-size: 20px;
    }
    .counter {
      text-transform: capitalize;
      font-size: 18px;
    }
  }
}
</style>
