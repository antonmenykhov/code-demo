<template>
  <SelectBox
    css-class="year-chooser"
    :value="year"
    label="Год"
    :options="years"
    @update:value="updateYear"
  />
</template>
<script lang="ts" setup>
import { SelectBox } from 'tnnc-ui-kit'
import { computed } from 'vue'

const props = defineProps<{
  year: number
  years?: number[]
}>()
const emit = defineEmits<{
  (e: 'update:year', data: number): void
}>()
const years = computed(() => {
  if (props.years) return props.years
  const years = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear - 5; i < currentYear + 5; i++) {
    years.push(i)
  }
  return years
})
function updateYear(data: number) {
  emit('update:year', data)
}
</script>
<style lang="scss">
.year-chooser {
  width: 100px;
}
</style>
