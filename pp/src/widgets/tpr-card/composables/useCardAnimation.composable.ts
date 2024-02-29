import type { Ref } from 'vue'

export default function useCardAnimation(card: Ref<HTMLElement | null>) {
  function vibrateElement(el: HTMLElement) {
    el.style.animation = `blink .2s 1`
    setTimeout(() => {
      el.style.animation = `vibrate .1s 3`
    }, 200)

    setTimeout(() => {
      el.style.animation = 'unset'
    }, 500)
  }

  function vibrateElementByQuerySelector(selector: string) {
    const el = card.value ? card.value.querySelector(selector) : null
    if (el && el instanceof HTMLElement) vibrateElement(el)
  }

  function vibrateElementByFieldName(filedName: string) {
    emitElementVibrationEvent(filedName)
    vibrateElementByQuerySelector(`[data-field='${filedName}']`)
  }

  function emitElementVibrationEvent(fieldName: string) {
    document.dispatchEvent(new CustomEvent('vibrateElement', { detail: fieldName }))
  }

  return { vibrateElement, vibrateElementByQuerySelector, vibrateElementByFieldName }
}
