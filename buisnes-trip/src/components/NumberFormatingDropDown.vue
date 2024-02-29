<template>
  <DropDownButton text="Формат чисел" list-css-class="number-formating-wrapper">
    <Toggle label="Отображать в тыс. руб." :value="isInThousands" @update:value="setMultyplier" />
    <div class="input-with-label-row">
      <p>Кол-во знаков после запятой</p>
      <NumberInput :value="lenghtAfterDot" @update:value="setLengthAfterDot" />
    </div>
  </DropDownButton>
</template>
<script lang="ts" setup>
import { DropDownButton, Toggle, NumberInput } from '@tnnc/tnnc-ui-kit'
import { computed } from 'vue'

const props = defineProps<{
  multyplier: 1 | 0.001
  lenghtAfterDot: number
}>()
const emit = defineEmits<{
  (e: 'update:multyplier', multyplier: 1 | 0.001): void
  (e: 'update:lenghtAfterDot', lenghtAfterDot: number): void
}>()

const isInThousands = computed(() => props.multyplier === 0.001)

function setMultyplier(newValue: boolean) {
  emit('update:multyplier', newValue ? 0.001 : 1)
}
function setLengthAfterDot(newValue: number | null) {
  emit('update:lenghtAfterDot', newValue || 0)
}
</script>
<style lang="scss">
.input-with-label-row {
  display: flex;
  justify-content: space-between;
}
.number-formating-wrapper {
  display: flex;
  flex-direction: column;
  width: 300px !important;
  border-top-right-radius: 10px !important;
  .tnnc-toggle {
    width: 100%;
  }
  .input-with-label-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > p {
      flex: 1;
      text-align: left;
      font-size: 16px;
      line-height: 18px;
      font-weight: 400;
    }
    & > div {
      width: 50px;
    }
  }
}
</style>
