<template>
  <div class="profit-factors">
    <CollapsableBlock
      class="index-color-blue"
      title="Факторы изменения общей выручки от бизнес-плана"
      :collapsed="collapsed_general"
      @update:collapsed="(value) => emit('update:collapsed_general', value)"
    >
      <div class="row">
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="generalDeviation_None"
          label="Отклонение"
          disabled
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="discountEconomySelf_GeneralForcesFactor"
          label="Скидка"
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="cancellWork_GeneralForcesFactor"
          label="Отмена объемов"
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="transferWork_GeneralForcesFactor"
          label="Перенос на след. год"
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="revisionWork_GeneralForcesFactor"
          label="Уточнение объемов"
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="closeCosts_GeneralForcesFactor"
          label="Закрытие по ф.з."
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="reduceTender_GeneralForcesFactor"
          label="Тендеры"
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="operationKNIPI_GeneralForcesFactor"
          label="По р.КНИПИ"
        />
        <CardTextInput
          :choosed-row="choosedRow"
          field="comments_GeneralForcesFactor"
          label="Коментарии"
          css-class="flex"
        />
      </div>
    </CollapsableBlock>
    <CollapsableBlock
      class="index-color-orange"
      title="Факторы изменения с/с выручки от бизнес-плана"
      :collapsed="collapsed_own"
      @update:collapsed="(value) => emit('update:collapsed_own', value)"
    >
      <div class="row">
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="ownDeviation_None"
          label="Отклонение"
          disabled
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="discountEconomySelf_OwnForcesFactor"
          label="Скидка"
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="cancellWork_OwnForcesFactor"
          label="Отмена объемов"
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="transferWork_OwnForcesFactor"
          label="Перенос на след. год"
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="revisionWork_OwnForcesFactor"
          label="Уточнение объемов"
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="moveSelf_OwnForcesFactor"
          label="Замена с/п на с/с"
        />
        <CardNumberInput
          :choosed-row="choosedRow"
          css-class="standart-width "
          field="operationKNIPI_OwnForcesFactor"
          label="По р.КНИПИ"
        />
        <CardTextInput
          :choosed-row="choosedRow"
          field="comments_OwnForcesFactor"
          label="Коментарии"
          css-class="flex"
        />
      </div>
    </CollapsableBlock>
  </div>
</template>
<script lang="ts" setup>
import type { TprStandart } from '@/interfaces/supp-entities/tpr-standart.interface'
import CardNumberInput from './CardNumberInput.vue'
import CardTextInput from './CardTextInput.vue'
import CollapsableBlock from './CollapsableBlock.vue'

const props = defineProps<{
  choosedRow: TprStandart
  collapsed_general: boolean
  collapsed_own: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed_general', value: boolean): void
  (e: 'update:collapsed_own', value: boolean): void
}>()
</script>

<style lang="scss">
.profit-factors {
  .standart-width {
    max-width: 140px;
  }
}
</style>
@/interfaces/supp-entities/tpr-standart.interface
