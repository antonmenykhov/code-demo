import type { Answer, CreateAnswerDto } from '@/interfaces/answer.interface'
import type { CreateRequestDto, Request } from '@/interfaces/request.interface'
import type { Ref } from 'vue'
import useDefaultCrud from './use-default-crud.composable'
import type { Form } from '@/interfaces/form.inteface'

export default function useRequestCardEdit(
  request: Ref<Request | undefined>,
  selectedForm: Ref<Form | undefined>,
  answers: Ref<Answer[]>
) {
  const {
    create: createRequest,
    update: updateRequest,
    getOne: getOneWithAnswersAndForm
  } = useDefaultCrud<Request, CreateRequestDto>('request')

  async function saveRequest() {
    if (!selectedForm.value) return
    if (!request.value) {
      await createRequest({ formId: selectedForm.value?.id }).then(({ data }) => {
        request.value = data
      })
    } else {
      await updateRequest(request.value.id, { formId: selectedForm.value.id })
    }
    await saveAnswers()
    request.value = await getOneWithAnswersAndForm(request.value?.id as number)
    answers.value = [...(request.value.answers || [])]
  }

  const {
    create: createAnswer,
    update: updateAnswer,
    remove: removeAnswer
  } = useDefaultCrud<Answer, CreateAnswerDto>('answer', undefined, true, false)

  async function saveAnswers() {
    for (let index = 0; index < answers.value.length; index++) {
      const answer = answers.value[index]
      if (!request.value) return
      if (answer.id === 0) {
        await createAnswer({
          answer: answer.answer,
          questionId: answer.questionId,
          requestId: request.value.id
        })
      } else {
        await updateAnswer(answer.id, {
          answer: answer.answer,
          questionId: answer.questionId,
          requestId: request.value.id
        })
      }
    }
    if (!request.value) return
    const asnswersForDelete =
      request.value.answers?.filter(
        (answer) => !answers.value.some((newAnswer) => newAnswer.id === answer.id)
      ) || []
    for await (const answer of asnswersForDelete) {
      await removeAnswer(answer.id)
    }
  }

  function setAnswer(index: number, answer: Answer) {
    if (index === -1) {
      answers.value.push(answer)
    } else {
      answers.value.splice(index, 1, answer)
    }
  }

  function removeAnswerByQuestion(id: number) {
    const index = answers.value.findIndex((answer) => answer.questionId === id)
    if (index !== -1) answers.value.splice(index, 1)
  }

  return { saveRequest, setAnswer, removeAnswerByQuestion, getOneWithAnswersAndForm }
}
