<template>
  <Editor
    tinymce-script-src="/tinymce/tinymce.min.js"
    :initial-value="value"
    @change="emitChange"
    :disabled="disabled"
    :init="{
      language: 'ru',
      menubar: 'edit format table tools help ',
      plugins: 'table lists ',
      toolbar:
        'undo redo  | fontfamily fontsize  | alignleft aligncenter alignright alignjustify | bold italic'
    }"
  />
</template>
<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'

const props = defineProps<{
  value: string
  disabled: boolean
}>()
const emit = defineEmits<{
  (e: 'update:value', data: string): void
}>()
function emitChange(e: any) {
  emit('update:value', e.level.content)
}
</script>
<style lang="scss">
.tox-promotion,
.tox-statusbar__branding {
  display: none;
}
.tox.tox-tinymce {
  border-color: #d9d9d9;
  border-width: 1px;
  transition: border-color 0.2s;
  &:hover {
    border-color: #4096ff;
  }
}
.tox .tox-edit-area__iframe {
  p {
    font-size: 50px !important;
  }
}
</style>
