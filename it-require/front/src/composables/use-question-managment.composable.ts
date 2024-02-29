import type { Question, CreateQuestionDto } from '@/interfaces/question.interface'
import useDefaultCrud from './use-default-crud.composable'
import type { CreateFormDto, Form } from '@/interfaces/form.inteface'
import { ref, type Ref } from 'vue'
import { confirm } from '@tnnc/tnnc-ui-kit'
import type { AxiosResponse } from 'axios'

export default function useQuestionManagment(
  form: Ref<Form>,
  updateForm: (id: number, form: CreateFormDto) => Promise<AxiosResponse<Form, any>>
) {
  const {
    getOne: getQuestionTree,
    create: createQuestion,
    update: updateQuestion,
    remove: removeQuestion
  } = useDefaultCrud<Question, CreateQuestionDto>('question')

  const questionTree = ref<Question>()

  async function getQuestionTreeWrappered() {
    if (form.value.questions?.length) {
      questionTree.value = await getQuestionTree(form.value.questions[0].id)
    } else {
      const question = (
        await createQuestion({
          isGroup: true,
          conditionParentValue: null,
          handbookId: null,
          order: 1,
          text: form.value.name,
          type: 'string',
          isRequired: false,
          description: ''
        })
      ).data
      await updateForm(form.value.id, { name: form.value.name, questions: [question] })
      form.value.questions = [question]
      questionTree.value = await getQuestionTree(question.id)
    }
  }

  async function saveQuestion(data: {
    question: Question
    parentId?: number
    childNumber: string
  }) {
    let { question } = data
    const { parentId } = data
    const {
      id,
      conditionParentValue,
      handbookId,
      text,
      type,
      isGroup,
      order,
      isRequired,
      description
    } = question
    if (id === 0) {
      question = (
        await createQuestion({
          conditionParentValue,
          handbookId,
          text,
          type,
          isGroup,
          parentId,
          order,
          isRequired,
          description
        })
      ).data
    } else {
      await updateQuestion(id, {
        conditionParentValue,
        handbookId,
        text,
        type,
        isGroup,
        parentId,
        order,
        isRequired,
        description
      })
    }
    await getQuestionTreeWrappered()
  }

  async function deleteQuestion(data: {
    question: Question
    parentId?: number
    childNumber: string
  }) {
    return confirm('Удалить вопрос?')
      .then(async () => {
        if (data.question.children?.length !== 0) {
          await confirm('Оставить потомки удаляемого вопроса?')
            .then(async () => {
              for await (const child of data.question.children as Question[]) {
                await updateQuestion(child.id, {
                  parentId: questionTree.value?.id as number,
                  conditionParentValue: child.conditionParentValue,
                  handbookId: child.handbookId,
                  text: child.text,
                  type: child.type,
                  isGroup: child.isGroup,
                  order: child.order,
                  isRequired: child.isRequired,
                  description: child.description
                })
              }
            })
            .catch(() => {})
        }
        await removeQuestion(data.question.id)
        getQuestionTreeWrappered()
      })
      .catch(() => {})
  }

  return { questionTree, saveQuestion, deleteQuestion, getQuestionTreeWrappered }
}
