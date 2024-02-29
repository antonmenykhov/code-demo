<template>
  <NumberInput :value="value" disabled :invalid="invalid" :invalid-text="invalidText" />
</template>
<script lang="ts" setup>
import type { Limit } from '@/interfaces/limit.interface'
import { NumberInput } from '@tnnc/tnnc-ui-kit'
import { computed } from 'vue'

const props = defineProps<{
  row: Limit
  invalid?: boolean
  invalidText?: string
}>()
const value = computed(
  () => props.row.daily_payment_percent + props.row.hotel_percent + props.row.transport_percent
)
</script>
