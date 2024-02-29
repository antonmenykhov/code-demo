<template>
  <div class="tpr-sub-migration">
    <ButtonComponent text="Сменить генподряд" @click="openPopup" />
    <PopupComponent
      title="Выберите генподряд"
      v-model:visible="isPopupVisible"
      height="90vh"
      width="90vw"
      @update:visible="(val) => (isTableVisible = val)"
    >
      <TprTableLight
        v-if="isTableVisible"
        :year="year"
        allow-selection
        only-gens
        @selection-changed="emitSelected"
        css-class="tpr-sub-migration-table"
        :available-departments="availableDepartments"
      />
    </PopupComponent>
  </div>
</template>
<script lang="ts" setup>
import type { Department } from '@/interfaces/supp-entities/department.interface'
import { ButtonComponent, PopupComponent } from 'tnnc-ui-kit'
import { ref } from 'vue'
import TprTableLight from '@/widgets/tpr-table/TprTableLight.vue'

const isPopupVisible = ref(false)
const isTableVisible = ref(false)
const props = defineProps<{
  year: number
  availableDepartments: Department[]
}>()
const emit = defineEmits<{
  (e: 'selected', id: number): void
}>()

function emitSelected(id: number) {
  emit('selected', id)
  isPopupVisible.value = false
  isTableVisible.value = false
}
function openPopup() {
  isPopupVisible.value = true
  setTimeout(() => {
    isTableVisible.value = true
  }, 100)
}
</script>
<style>
.tpr-sub-migration-table {
  height: calc(90vh - 75px);
  background: var(--tnnc-color-gray-light);
  padding: 5px;
}
</style>
