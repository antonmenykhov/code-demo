<template>
  <div class="document-cell">
    <ul v-if="row._rawRow">
      <li class="file-item" v-for="file in row._rawRow.docs" :key="file.path">
        <a :href="`${baseUrl.baseUrl}${file.path}`" target="_blank" download>{{ file.name }}</a>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import baseUrl from '@/config/baseUrl'
import type { AnswerActionRowDto } from '@/interfaces/answer-action-row.interface'

const props = defineProps<{
  row: { _rawRow: AnswerActionRowDto }
}>()
</script>
