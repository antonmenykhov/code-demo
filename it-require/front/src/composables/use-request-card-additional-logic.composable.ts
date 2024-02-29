import type { Answer } from '@/interfaces/answer.interface'
import { computed, watch, ref, type Ref } from 'vue'
import useDefaultCrud from './use-default-crud.composable'
import type { Question } from '@/interfaces/question.interface'
import type { Handbook } from '@/interfaces/hadnbook.interface'

export default function useRequestCardAdditionalLogic(
  answers: Ref<Answer[]>,
  questionTree: Ref<Question | undefined>
) {
  function getQuestionCount() {
    questionCount.value = document.querySelectorAll('.question-editor').length || 0
  }

  const answersLength = computed(() => answers.value.length)
  watch(answersLength, () =>
    setTimeout(() => {
      getQuestionCount()
    }, 0)
  )

  const questionCount = ref(0)
  const progressCount = computed(
    () => +((answers.value.length / questionCount.value) * 100).toFixed()
  )

  const { getOne: getHandbook } = useDefaultCrud<Handbook>('handbook')
  const handbooks = ref<Handbook[]>([])

  function getHandbookIdsFromQuestion(question: Question) {
    const handbookIdsList: number[] = []
    if (question.handbookId) handbookIdsList.push(question.handbookId)
    question.children?.forEach((child) => {
      handbookIdsList.push(...getHandbookIdsFromQuestion(child))
    })
    return handbookIdsList
  }

  async function getHandbooks() {
    if (!questionTree.value) return
    const handbookIds = new Set<number>(getHandbookIdsFromQuestion(questionTree.value))
    for await (const handbookId of handbookIds) {
      handbooks.value.push(await getHandbook(handbookId))
    }
  }

  return { progressCount, getQuestionCount, handbooks, getHandbooks }
}
