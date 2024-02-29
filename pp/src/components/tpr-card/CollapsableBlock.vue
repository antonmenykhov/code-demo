<template>
  <div class="tpr-card-collapsable-block">
    <div class="title row">
      <div class="title row">
        <h4 @click="toggleCollapsed">
          {{ title }}
        </h4>
        <LabelComponent v-if="hasFieldsWithErrors" type="danger" text="Есть ошибки!" />
      </div>
      <ButtonComponent
        :icon-class="`fa-solid fa-chevron-up ${collapsed ? 'collapsed' : ''}`"
        @click="toggleCollapsed"
      />
    </div>
    <div class="content-wrapper" ref="contentWrapper" :style="`height:${contentWrapperHeight}`">
      <div class="content" ref="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ButtonComponent, LabelComponent } from 'tnnc-ui-kit'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import useCardFieldsInElement from '@/widgets/tpr-card/composables/useCardFieldsInElement.composable'

const props = defineProps<{
  collapsed: boolean
  title: string
  cssClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', data: boolean): void
}>()
function toggleCollapsed() {
  emit('update:collapsed', !props.collapsed)
}

const content = ref<HTMLElement>()
const contentWrapper = ref<HTMLElement>()
const contentWrapperHeight = ref('auto')

function toggleContentHeight() {
  if (content.value && contentWrapper.value) {
    if (props.collapsed) {
      if (contentWrapper.value.style.height === 'auto')
        contentWrapperHeight.value = `${content.value.scrollHeight}px`
      setTimeout(() => {
        contentWrapperHeight.value = '0px'
      }, 100)
    } else {
      contentWrapperHeight.value = `${content.value.scrollHeight}px`
      setTimeout(() => {
        contentWrapperHeight.value = 'auto'
      }, 200)
    }
  }
}
function toggleContentHeightOnMounted() {
  if (props.collapsed) contentWrapperHeight.value = '0px'
}
toggleContentHeightOnMounted()
onMounted(() => {
  document.addEventListener('vibrateElement', expandPanelIfHasFiled)
})
const collapsed = computed(() => props.collapsed)
watch(collapsed, toggleContentHeight)

onBeforeUnmount(() => {
  document.removeEventListener('vibrateElement', expandPanelIfHasFiled)
})
function expandPanelIfHasFiled(e: CustomEvent<string>) {
  if (fieldsInBlock.value.includes(e.detail) && props.collapsed) toggleCollapsed()
}

const { hasFieldsWithErrors, fieldsInBlock } = useCardFieldsInElement(content)
</script>
<style lang="scss">
.tpr-card-collapsable-block {
  background: var(--tnnc-color-gray-light);
  padding: 5px;
  margin-bottom: 10px;
  .content-wrapper {
    transition: all 0.2s;
    overflow: hidden;
  }
  .content {
    min-height: 0px;
    transition: all 0.2s;
  }
  .title {
    align-items: center !important;
    h4 {
      margin: 0;
      padding: 0;
      cursor: pointer;
    }
    .tnnc-button {
      height: 24px;
      width: 24px;
      background: rgba(255, 255, 255, 0.514);
      box-shadow: none;
      &:hover {
        background: rgb(255, 255, 255);
      }
      i {
        font-size: 13px;
        transition: all 0.2s;
        &.collapsed {
          transform: rotateX(180deg);
        }
      }
    }
  }
}
</style>
