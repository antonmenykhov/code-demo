<template>
  <div class="container">
    <h1>КД к моим замечаниям</h1>
    <AnswersTable with-actions :is-admin="false" :url="url" />
  </div>
</template>
<script lang="ts" setup>
import AnswersTable from '@/components/AnswersTable.vue'
import baseUrl from '@/config/baseUrl'

const url = `${baseUrl.baseUrl}/answer/respondent/with-actions`
</script>
