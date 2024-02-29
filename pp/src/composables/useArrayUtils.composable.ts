import type { Ref } from 'vue'

export default function useArrayUtils() {
  function replaceElement<T, K extends keyof T>(arr: Ref<T[]>, item: T, idName: K) {
    const existIndex = arr.value.findIndex((it) => it[idName] === item[idName])
    if (existIndex !== -1) {
      arr.value.splice(existIndex, 1, item)
    } else {
      arr.value.push(item)
    }
  }

  function deleteElement<T, K extends keyof T>(arr: Ref<T[]>, item: T, idName: K) {
    const existIndex = arr.value.findIndex((it) => it[idName] === item[idName])
    if (existIndex !== -1) {
      arr.value.splice(existIndex, 1)
    }
  }

  return { replaceElement, deleteElement }
}
