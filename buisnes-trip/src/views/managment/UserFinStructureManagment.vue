<template>
  <div class="container">
    <HandbookTable multiply-name="user_access" name="user_access" :can-edit="true" />
  </div>
</template>
<script lang="ts" setup>
import HandbookTable from '@/components/HandbookTable.vue'
</script>
