import { type Ref, ref } from 'vue';

export default function useContextMenu() {
  const mouseEvent: Ref<MouseEvent> = ref() as Ref<MouseEvent>;
  const contextMenuVisible = ref(false);
  function contextMenuHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (
      (target.closest('th') && !target.closest('.manage-cell')) ||
      target.closest('.tnnc-group-header')
    ) {
      e.preventDefault();
      contextMenuVisible.value = true;
      mouseEvent.value = e;
    }
  }
  return { mouseEvent, contextMenuVisible, contextMenuHandler };
}
