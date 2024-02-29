<template>
  <div class="card-block">
    <div class="block-name">{{ blockName }}</div>
    <div class="content"><slot></slot></div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  blockName: string
}>()
</script>
<style lang="scss" scoped>
.card-block {
  display: flex;
  box-shadow: inset 0px 0px 0px 2px var(--tnnc-add-color-gray-4);
  margin-bottom: 10px;
  .block-name {
    writing-mode: vertical-lr;
    transform: rotateZ(180deg);
    text-align: center;
    font-weight: 700;
    font-size: 50px;
    color: white;
    background: var(--tnnc-add-color-gray-4);
    padding: 4px 0;
    padding-left: 4px;
    line-height: 1.1;
    &::selection {
      background: transparent;
    }
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 7px;
    justify-content: flex-start;
  }
}
</style>
