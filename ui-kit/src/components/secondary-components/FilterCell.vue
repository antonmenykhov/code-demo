<template>
  <td
    :class="[
      column.name,
      column.cssClass,
      {
        'tnnc-fixed-column': column.fixed,
        'tnnc-has-value': filterValue.length,
      },
    ]"
    :style="`left: ${column.offset}px`"
    :colspan="column.colspan"
    class="tnnc-table-filter-cell"
    @click="calcCollection"
  >
    <DatePicker
      v-if="column.columnType === 'date' || column.columnType === 'datetime'"
      :with-time="column.columnType === 'datetime'"
      :value="dateValue"
      :show-clear-button="filterValue.length > 0"
      @update:value="setDateValue"
    >
      <template #prefix>
        <DropDownSelector
          :icons-only="true"
          :options="filterTypes"
          v-model:value="filterType"
          @update:value="setFilterTypeChanging"
        />
      </template>
    </DatePicker>
    <NumberInput
      v-else-if="
        column.columnType === 'number' || column.columnType === 'computed'
      "
      :value="numberValue"
      :show-clear-button="numberValue !== null"
      @update:value="setNumberValue"
    >
      <template #prefix>
        <DropDownSelector
          :icons-only="true"
          :options="filterTypes"
          v-model:value="filterType"
          @update:value="setFilterTypeChanging"
        />
      </template>
    </NumberInput>
    <SelectBox
      v-else-if="column.columnType !== 'manage'"
      :options="collection"
      :value="filterValue"
      :allow-search="true"
      :show-clear-button="filterValue.length > 0"
      option-css-class="tnnc-filter-options"
      @update:value="setValue"
    />
  </td>
</template>
<script lang="ts" setup>
import type TableColumn from '@/classes/table-column.class';
import type {
  FilterCollection,
  FilterType,
  FilterValue,
} from '@/composables/useFilters.composable';
import { useDateFormat } from '@vueuse/shared';
import { computed, ref, type Ref } from 'vue';
import DatePicker from '../DatePicker.vue';
import NumberInput from '../NumberInput.vue';
import SelectBox, { type OptionValue } from '../SelectBox.vue';
import DropDownSelector from './DropDownSelector.vue';

const props = defineProps<{
  filterCollection: FilterCollection[];
  filterSet: FilterValue[];
  column: TableColumn;
}>();
const emit = defineEmits<{
  (e: 'update:filterSet', data: FilterValue[]): void;
}>();
const collection: Ref<Array<string | number>> = ref([]);
function calcCollection() {
  const propCollection = props.filterCollection.find(
    (collection) => collection.columnName === props.column.name,
  );
  if (propCollection) {
    collection.value = Array.from(propCollection.collection).sort((a, b) => {
      if (a === '(Пусто)') return -1;
      if (getValue(a) > getValue(b)) return 1;
      if (getValue(b) > getValue(a)) return -1;
      return 0;
    });
  }
}
const filterValue = computed(() => {
  let value: Array<string | number> = [];
  const propFilterSet = props.filterSet.find(
    (set) => set.columnName === props.column.name,
  );
  if (propFilterSet) {
    value = Array.from(propFilterSet.filterSet);
  }
  return value;
});

const dateValue = computed(() => {
  let value: string | null = '';
  const propFilterSet = props.filterSet.find(
    (set) => set.columnName === props.column.name,
  );
  if (propFilterSet && propFilterSet.filterSet.size > 0) {
    const valueArr = `${Array.from(propFilterSet.filterSet)[0]}`.split('.');
    if (valueArr.length !== 3) return null;
    valueArr.splice(0, 1, valueArr.splice(1, 1, valueArr[0])[0]);
    value = valueArr.join('.');
  }
  return value;
});

const numberValue = computed(() => {
  let value: number | null = null;
  const propFilterSet = props.filterSet.find(
    (set) => set.columnName === props.column.name,
  );
  if (propFilterSet && propFilterSet.filterSet.size > 0) {
    value = +Array.from(propFilterSet.filterSet)[0];
  }
  return value;
});

const filterType: Ref<FilterType> = ref('equals');
const filterTypes = ref([
  {
    value: 'equals',
    icon: 'fa-solid fa-equals',
    name: 'Равно',
  },
  {
    value: 'gt',
    icon: 'fa-solid fa-greater-than',
    name: 'Больше',
  },
  {
    value: 'lt',
    icon: 'fa-solid fa-less-than',
    name: 'Меньше',
  },
]);

function setValue(newValue: OptionValue) {
  const { column, filterSet } = props;
  const newFilterSet = [...filterSet];
  const newFilterValue: FilterValue = {
    filterType: filterType.value,
    columnName: column.name,
    filterSet: new Set(newValue as Array<string | number>),
  };
  const existFilterIndex = newFilterSet.findIndex(
    (value) => value.columnName === column.name,
  );
  if (existFilterIndex !== -1) newFilterSet.splice(existFilterIndex, 1);
  if (newFilterValue.filterSet.size > 0) newFilterSet.push(newFilterValue);

  emit('update:filterSet', newFilterSet);
}

function setFilterTypeChanging() {
  const { column, filterSet } = props;
  const newFilterSet = [...filterSet];
  const existFilterIndex = newFilterSet.findIndex(
    (value) => value.columnName === column.name,
  );
  if (existFilterIndex !== -1) {
    const newFilterValue = {
      ...newFilterSet[existFilterIndex],
      filterType: filterType.value,
    };
    newFilterSet.splice(existFilterIndex, 1, newFilterValue);
    emit('update:filterSet', newFilterSet);
  }
}

function setDateValue(newValue: string | null) {
  const { column, filterSet } = props;
  const newFilterSet = [...filterSet];
  const newFilterValue: FilterValue = {
    filterType: filterType.value,
    columnName: column.name,
    filterSet: new Set<string | number>(),
  };
  if (newValue)
    newFilterValue.filterSet.add(
      useDateFormat(
        newValue,
        column.columnType === 'date' ? 'DD.MM.YYYY' : 'DD.MM.YYYY HH:mm',
      ).value,
    );
  const existFilterIndex = newFilterSet.findIndex(
    (value) => value.columnName === column.name,
  );
  if (existFilterIndex !== -1) newFilterSet.splice(existFilterIndex, 1);
  if (newFilterValue.filterSet.size > 0) newFilterSet.push(newFilterValue);
  emit('update:filterSet', newFilterSet);
}

function setNumberValue(newValue: number | null) {
  const { column, filterSet } = props;
  const newFilterSet = [...filterSet];
  const newFilterValue: FilterValue = {
    filterType: filterType.value,
    columnName: column.name,
    filterSet: new Set<string | number>(),
  };
  if (newValue !== null && newValue !== undefined)
    newFilterValue.filterSet.add(newValue);
  const existFilterIndex = newFilterSet.findIndex(
    (value) => value.columnName === column.name,
  );
  if (existFilterIndex !== -1) newFilterSet.splice(existFilterIndex, 1);
  if (newFilterValue.filterSet.size > 0) newFilterSet.push(newFilterValue);
  emit('update:filterSet', newFilterSet);
}

function getValue(initValue: string | number) {
  if (props.column.columnType === 'number') {
    return +`${initValue}`.split(' ').join('');
  }
  if (props.column.columnType === 'date') {
    const value = (initValue as string).split('.');
    if (value.length !== 3) return new Date('01.01.1970');
    value.splice(0, 1, value.splice(1, 1, value[0])[0]);
    return new Date(value.join('.'));
  }
  if (props.column.columnType === 'datetime') {
    const dateTimeArr = (initValue as string).split(' ');
    if (dateTimeArr.length < 2) return new Date('01.01.1970');
    const dateValue = (dateTimeArr[0] as string).split('.');
    if (dateValue.length !== 3) return new Date('01.01.1970');
    dateValue.splice(0, 1, dateValue.splice(1, 1, dateValue[0])[0]);
    return new Date(`${dateValue.join('.')}T${dateTimeArr[1]}:00`);
  }
  if (props.column.columnType === 'computed') {
    const value = initValue as string;
    if (value === '(Пусто)') return '';
    const numbericValue = +(initValue as string).split(' ').join('');
    return isFinite(numbericValue) ? numbericValue : value;
  }
  if (
    (props.column.columnType === 'string' ||
      props.column.columnType === 'boolean' ||
      props.column.columnType === 'enum') &&
    initValue === '(Пусто)'
  )
    return '';
  return initValue;
}
</script>
<style>
.tnnc-filter-options {
  min-width: 200px !important;
  padding: 10px;
  border-top-right-radius: 10px !important;
}
.tnnc-has-value {
  background: var(--tnnc-color-orange) !important;
}
</style>
