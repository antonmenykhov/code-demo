<template>
  <div class="pdf-viewer" :style="`height:${height}`">
    <VuePdfApp :pdf="url" :config="config">
      <template #toolbar-right-prepend>
        <button
          class="toolbarButton print vue-pdf-app-icon print-button"
          @click="print"
          title="Печать"
        >
          <span data-l10n-id="print_label">Печать</span>
        </button>
        <button
          class="toolbarButton open-file vue-pdf-app-icon open-file"
          @click="printWithoutSign"
          title="Печать без подписи"
        >
          <span data-l10n-id="print_label">Печать без подписи</span>
        </button>
        <button
          class="toolbarButton download hiddenMediumView vue-pdf-app-icon download-button"
          title="Скачать"
          @click="downloadFile"
        >
          <span data-l10n-id="download_label">Скачать</span>
        </button>
      </template>
    </VuePdfApp>
  </div>
</template>
<script lang="ts" setup>
import { useUserInfoStore } from '@/stores/userInfoStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import VuePdfApp from 'vue3-pdf-app'
import 'vue3-pdf-app/dist/icons/main.css'
import printJS from 'print-js'
import useHttp from '@/composables/useHttp.composable'

const props = withDefaults(
  defineProps<{
    source: string
    fileName: string
    height?: string
    width?: string
  }>(),
  { height: '800px', width: '700px' }
)

const emit = defineEmits<{
  (e: 'printWithoutSign'): void
}>()

const { token } = storeToRefs(useUserInfoStore())
const url = computed(() => `${props.source}?token=Bearer ${token.value}`)

function print() {
  printJS(url.value)
}
function printWithoutSign() {
  emit('printWithoutSign')
}
const config = {
  toolbar: {
    toolbarViewerMiddle: {
      scaleSelectContainer: false
    },
    toolbarViewerRight: {
      openFile: false,
      download: false,
      viewBookmark: false,
      print: false
    },
    toolbarViewerLeft: {
      previous: false,
      next: false,
      pageNumber: false,
      numPages: false
    }
  }
}

const { http } = useHttp()
function downloadFile() {
  http.get(url.value, { responseType: 'blob' }).then(({ data }) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(data)
    link.download = `${props.fileName}.pdf`
    link.click()
    URL.revokeObjectURL(link.href)
  })
}
</script>
<style lang="scss">
:root {
  --sidebar-width: 200px !important;
}
.pdf-app #thumbnailView {
  width: 100% !important;
}
.pdf-viewer {
  position: relative;
}
</style>
