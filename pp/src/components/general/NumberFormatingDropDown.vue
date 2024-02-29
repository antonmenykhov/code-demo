<template>
  <div class="number-formating-wrapper">
    <Toggle label="Отображать в тыс. руб." :value="isInThousands" @update:value="setMultyplier" />
    <div class="input-with-label-row">
      <p>Кол-во знаков после запятой</p>
      <NumberInput :value="lenghtAfterDot" @update:value="setLengthAfterDot" placeholder="0" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useLoadingState } from '@/store/loading.state'
import { Toggle, NumberInput } from 'tnnc-ui-kit'
import { computed } from 'vue'

const { setManualLoading } = useLoadingState()
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
  setManualLoading(true)
  setTimeout(() => {
    emit('update:multyplier', newValue ? 0.001 : 1)
  }, 50)
}
function setLengthAfterDot(newValue: number | null) {
  if (newValue !== null && newValue !== props.lenghtAfterDot) {
    setManualLoading(true)
    setTimeout(() => {
      emit('update:lenghtAfterDot', newValue || 0)
    }, 50)
  }
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
