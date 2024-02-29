import baseUrl from '@/config/baseUrl'
import type { QuestionGroup } from '@/interfaces/question-group.interface'
import type { AxiosInstance } from 'axios'
import { inject, ref, type Ref } from 'vue'

export default function useBlocks() {
  const http = inject('http') as AxiosInstance
  const url = `${baseUrl.baseUrl}/question-group`
  const questionGroups: Ref<QuestionGroup[]> = ref([])

  function getQuestionGroups() {
    http.get(url).then(({ data }) => {
      questionGroups.value = data
    })
  }

  getQuestionGroups()

  async function addQuestionGroup(name: string, departmentId: string, disableZeroAnswers: boolean) {
    return http
      .post(url, {
        name,
        departmentId,
        disableZeroAnswers,
        order:
          questionGroups.value.length > 0
            ? questionGroups.value[questionGroups.value.length - 1].order + 1
            : 1
      })
      .then(({ data }) => {
        questionGroups.value.push(data)
      })
  }

  async function changeQuestionGroup(questionGroup: QuestionGroup) {
    return http
      .patch(`${url}/${questionGroup.id}`, {
        ...questionGroup,
        id: undefined,
        responsibles: undefined,
        questions: undefined
      })
      .then(() => {
        const index = questionGroups.value.findIndex((qg) => qg.id === questionGroup.id)
        if (index !== -1) questionGroups.value.splice(index, 1, questionGroup)
      })
  }

  async function deleteQuestionGroup(id: number) {
    return http.delete(`${url}/${id}`).then(() => {
      const index = questionGroups.value.findIndex((qg) => qg.id === id)
      if (index !== -1) questionGroups.value.splice(index, 1)
    })
  }

  async function reorderQuestionGroup(newOrder: number, oldOrder: number) {
    return http
      .post(`${url}/reorder`, { newOrder, oldOrder })
      .then(({ data }) => (questionGroups.value = data))
  }

  return {
    getQuestionGroups,
    questionGroups,
    addQuestionGroup,
    changeQuestionGroup,
    deleteQuestionGroup,
    reorderQuestionGroup
  }
}
