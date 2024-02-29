<template>
  <div class="tpr-card-panel" :style="flexDirectionStyle">
    <div class="content" ref="content">
      <div class="content-wrapper" :class="cssClass">
        <slot></slot>
      </div>
    </div>
    <div
      title="Кликните для того чтобы свернуть\развернуть панель"
      class="collapse-button"
      @click="togglePanel"
      :class="{ active: !collapsed }"
    >
      <div class="title row">
        <div class="name">{{ panelName }}</div>
        <LabelComponent v-if="hasFieldsWithErrors" type="danger" text="Есть ошибки!" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import useCardFieldsInElement from '@/widgets/tpr-card/composables/useCardFieldsInElement.composable'
import { LabelComponent } from 'tnnc-ui-kit'

const props = defineProps<{
  collapsed: boolean
  panelName: string
  positon: 'left' | 'right'
  cssClass?: string
}>()
const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

const flexDirectionStyle = computed(() =>
  props.positon === 'right' ? '' : 'flex-direction:row-reverse'
)
function togglePanel() {
  emit('update:collapsed', !props.collapsed)
}
const content = ref<HTMLElement>()
function toggleContentWidth() {
  requestAnimationFrame(() => {
    if (content.value) {
      if (props.collapsed) {
        content.value.style.width = '0px'
      } else {
        content.value.style.width = `${content.value.scrollWidth}px`
      }
    }
  })
}
onMounted(() => {
  setTimeout(() => {
    toggleContentWidth()
  }, 1)
  document.addEventListener('vibrateElement', expandPanelIfHasFiled)
})
onBeforeUnmount(() => {
  document.removeEventListener('vibrateElement', expandPanelIfHasFiled)
})
function expandPanelIfHasFiled(e: CustomEvent<string>) {
  if (fieldsInBlock.value.includes(e.detail) && props.collapsed) togglePanel()
}
const collapsed = computed(() => props.collapsed)
watch(collapsed, toggleContentWidth)
const { hasFieldsWithErrors, fieldsInBlock } = useCardFieldsInElement(content)
</script>
<style lang="scss">
.tpr-card-panel {
  height: auto;
  display: flex;
  .content {
    height: 100%;
    flex: 1;
    overflow: hidden;
    transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
    .content-wrapper {
      height: 100%;
    }
  }
  .collapse-button {
    background: var(--tnnc-color-gray-light);
    width: 30px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    transition: all 0.1s;
    cursor: pointer;
    .title {
      writing-mode: vertical-lr;
      transform: rotateZ(180deg);
      top: 10px;
      font-weight: 500;
      color: rgb(179, 179, 179);
      transition: all 0.1s;
      display: flex;
      gap: 10px;
      align-items: center;
      .tnnc-label {
        padding: 8px 2px;
      }
    }
    &:hover,
    &.active {
      background: #eff5fbb6;
      .title {
        color: #333;
      }
    }
  }
}
</style>
