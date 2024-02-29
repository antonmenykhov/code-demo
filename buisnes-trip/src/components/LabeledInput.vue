<template>
  <div class="labeled-input">
    <div class="label">{{ label }}</div>
    <div class="input">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  label: string
}>()
</script>
<style lang="scss" scoped>
.labeled-input {
  display: flex;
  align-items: center;
  gap: 10px;
  .label {
    width: 250px;
    text-align: right;
  }
  .input {
    flex: 1 1 100px;
    & > * {
      flex: 1;
    }
  }
}
</style>
