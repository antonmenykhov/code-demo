<template>
  <tr
    ref="tableRow"
    :data-index="row['_index']"
    class="tnnc-table-row"
    :class="[
      row._rowCssClass,
      {
        'tnnc-table-expanded-row': true,
      },
    ]"
  >
    <td
      v-for="col in columns"
      :key="col.name"
      class="tnnc-table-cell"
      :class="[
        col.name,
        col.cssClass,
        col.columnType,
        calcCssClass(col, row),
        { 'tnnc-fixed-column': col.fixed },
      ]"
      :style="`left: ${col.offset}px`"
      :colspan="col.colspan"
      :data-row-id="row[tableProps.keyExpr]"
      :data-column-name="col.name"
    >
      <component
        v-if="col.templating?.editor"
        :is="col.templating.editor"
        :column="col"
        :row="editableRow"
        :tableProps="tableProps"
        :masterDetailOpened="masterDetailOpened"
        :meta="meta"
        :is-editing="true"
        :selectedRowsIds="selectedRowsIds"
        :invalid="validation[col.name]?.invalid || false"
        :invalid-text="validation[col.name]?.invalidText || ''"
        :has-invalid-values="hasInvalidValues"
        :editable="col.editable && getComputedEditable(col)"
        @saveRow="saveRow"
      />
      <div
        v-else-if="
          col.templating?.cellHtml &&
          !(col.editable && getComputedEditable(col))
        "
        v-html="
          col.templating.cellHtml(
            row._rawRow,
            col,
            props.tableProps.numberFormatingEd,
            props.tableProps.numberFormatingRazryad,
            props.meta,
          )
        "
      ></div>
      <template v-else-if="col.editable && getComputedEditable(col)">
        <TextAreaInput
          v-if="col.columnType === 'string'"
          :rows="5"
          :show-counter="false"
          :invalid="validation[col.name]?.invalid || false"
          :invalid-text="validation[col.name]?.invalidText || ''"
          v-model:value="(editableRow[col.name] as string|number)"
        />
        <SelectBox
          v-else-if="
            col.columnType === 'enum' &&
            col.lookup?.handbook &&
            col.lookup?.displayExpr &&
            col.lookup?.valueExpr
          "
          :options="
            col.allowNullForSelection
              ? [
                  {
                    [col.lookup.displayExpr]: '(Пусто)',
                    [col.lookup.valueExpr]: null,
                  },
                  ...col.lookup.handbook,
                ]
              : col.lookup.handbook
          "
          :value-expr="col.lookup.valueExpr"
          :display-expr="col.lookup.displayExpr"
          allow-search
          :invalid="validation[col.name]?.invalid || false"
          :invalid-text="validation[col.name]?.invalidText || ''"
          v-model:value="editableRow[col.name]"
        />
        <SelectBox
          v-else-if="col.columnType === 'boolean'"
          :options="getBooleanHandbook(col)"
          display-expr="display"
          value-expr="value"
          :invalid="validation[col.name]?.invalid || false"
          :invalid-text="validation[col.name]?.invalidText || ''"
          v-model:value="editableRow[col.name]"
        />
        <NumberInput
          v-else-if="col.columnType === 'number'"
          :invalid="validation[col.name]?.invalid || false"
          :invalid-text="validation[col.name]?.invalidText || ''"
          v-model:value="(editableRow[col.name] as number)"
        />
        <DatePicker
          v-else-if="col.columnType === 'date' || col.columnType === 'datetime'"
          :with-time="col.columnType === 'datetime'"
          :invalid="validation[col.name]?.invalid || false"
          :invalid-text="validation[col.name]?.invalidText || ''"
          v-model:value="(editableRow[col.name] as  string | null)"
        />
        <template v-else>{{
          row[col.name] === '(Пусто)' ? '' : row[col.name]
        }}</template>
      </template>
      <template v-else>{{
        row[col.name] === '(Пусто)' ? '' : row[col.name]
      }}</template>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import type TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import {
  computed,
  inject,
  ref,
  type Component,
  onMounted,
  type Ref,
  onBeforeUnmount,
  provide,
} from 'vue';
import DatePicker from '../DatePicker.vue';
import NumberInput from '../NumberInput.vue';
import SelectBox from '../SelectBox.vue';
import type { Handbook, Meta } from '../TableComponent.vue';
import TextAreaInput from '../TextAreaInput.vue';
import type { CustomManageButton } from './ManageCell.vue';

const props = defineProps<{
  row: TableRow;
  columns: TableColumn[];
  allPlainColumns: TableColumn[];
  tableProps: {
    allowAdd: boolean;
    allowDelete: boolean;
    allowEdit: boolean;
    allowExpand: boolean;
    allowFilter: boolean;
    addEnumId: boolean;
    allowPagination: boolean;
    allowRowCounter: boolean;
    allowSelection: boolean;
    allowToolbar: boolean;
    allowColumnNumeration: boolean;
    keyExpr: string;
    numberFormatingEd: number;
    numberFormatingRazryad: number;
    expanderTemplate?: Component;
    expandablePropertyName: string;
    customManageButtons?: CustomManageButton[];
    allowReordering: boolean;
  };
  meta?: Meta;
  masterDetailOpened: Set<string>;
  expandedRows: Set<string | number>;
  rawRows: TableRow[];
  selectedRowsIds: Set<string>;
}>();
function createNewRow() {
  const newRow: TableRow = {} as TableRow;
  props.allPlainColumns.forEach((column) => {
    newRow[column.name] = '';
    if (column.columnType === 'number') {
      newRow[column.name] = 0;
    }
    if (column.defaultValue !== undefined) {
      newRow[column.name] = column.defaultValue;
    }
  });
  newRow[props.tableProps.keyExpr] = 'new';
  return newRow;
}

function getEditableRow() {
  const { rawRows, tableProps, row } = props;
  const id = row[tableProps.keyExpr];
  if (id === 'new') return createNewRow();
  const newEditableRow = JSON.parse(
    JSON.stringify(rawRows.find((rawRow) => rawRow[tableProps.keyExpr] === id)),
  ) as TableRow | undefined;
  return newEditableRow ? newEditableRow : createNewRow();
}
const editableRow = ref(getEditableRow());

function calcCssClass(column: TableColumn, row: TableRow) {
  if (column.computing?.cssClass) {
    return column.computing.cssClass(
      row,
      column,
      props.tableProps.numberFormatingEd,
      props.tableProps.numberFormatingRazryad,
      props.meta,
    );
  }
  return '';
}

function getBooleanHandbook(column: TableColumn) {
  const handbook: { value: boolean | null; display: string }[] = [
    {
      value: null,
      display: '(Пусто)',
    },
    {
      value: true,
      display: column.trueValue || 'Да',
    },
    {
      value: false,
      display: column.falseValue || 'Нет',
    },
  ];
  if (column.allowNullForSelection) return handbook;
  return handbook.filter((item) => item.value !== null);
}

function getComputedEditable(column: TableColumn) {
  if (column.computing?.editing) {
    const { row, tableProps, meta } = props;
    return column.computing.editing(
      row,
      column,
      tableProps.numberFormatingEd,
      tableProps.numberFormatingRazryad,
      meta,
    );
  }
  return true;
}

const diffRow = computed(() => {
  const originalRow = getEditableRow();
  const diff = {} as TableRow;
  Object.keys(editableRow.value).forEach((key) => {
    if (editableRow.value[key] !== originalRow[key])
      diff[key] = editableRow.value[key];
  });
  Object.keys(diff).forEach((key) => {
    const column = props.columns.find((col) => col.name === key);
    if (column && column.columnType === 'enum' && props.tableProps.addEnumId) {
      const handbookItem = (column.lookup?.handbook as Handbook[]).find(
        (item) => item[column.lookup?.valueExpr as string] === diff[key],
      );
      diff[`${key}_id`] = handbookItem
        ? handbookItem[column.lookup?.idExpr as string]
        : null;
    }
  });
  return diff;
});
const saveRowInjected = inject('saveRow') as (
  rowData: TableRow,
  diff: TableRow,
) => void;
function saveRow() {
  if (hasInvalidValues.value) return;
  saveRowInjected(editableRow.value, diffRow.value);
}

const tableRow: Ref<HTMLElement | null> = ref(null);
const tableElement = computed(() =>
  tableRow.value ? tableRow.value.closest('table') : null,
);
function setRow(newRow: TableRow) {
  editableRow.value = newRow;
}
provide('setRow', setRow);
onMounted(() => {
  if (tableElement.value) {
    tableElement.value.addEventListener(
      `tnnc-table-save-row-${
        editableRow.value[props.tableProps.keyExpr] as string
      }`,
      saveRow,
    );
  }
});
onBeforeUnmount(() => {
  if (tableElement.value) {
    tableElement.value.removeEventListener(
      `tnnc-table-save-row-${
        editableRow.value[props.tableProps.keyExpr] as string
      }`,
      saveRow,
    );
  }
});

const validation = computed(() => {
  const validationObject: {
    [key: string]: { invalid: boolean; invalidText: string };
  } = {};
  props.allPlainColumns.forEach((column) => {
    validationObject[column.name] = { invalid: false, invalidText: '' };
    if (column.validation) {
      if (column.validation.isReqired) {
        const currentValue = editableRow.value[column.name];
        const invalid =
          currentValue === null ||
          currentValue === undefined ||
          currentValue === '';
        const invalidText = invalid ? `Поле обязательно к заполнению!` : '';
        validationObject[column.name] = { invalid, invalidText };
      }
      if (column.validation.func) {
        const { isValid, message } = column.validation.func(
          editableRow.value,
          column,
        );
        validationObject[column.name] = {
          invalid: !isValid,
          invalidText: message,
        };
      }
    }
  });
  return validationObject;
});

const hasInvalidValues = computed(() =>
  Object.keys(validation.value).some((key) => validation.value[key].invalid),
);
</script>
