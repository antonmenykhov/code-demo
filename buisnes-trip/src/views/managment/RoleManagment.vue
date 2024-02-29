<template>
  <div class="container">
    <HandbookTable multiply-name="user_roles" name="user_role" :can-edit="true" />
  </div>
</template>
<script lang="ts" setup>
import HandbookTable from '@/components/HandbookTable.vue'
</script>
