import type { Component } from 'vue';
import type { TableRow } from './table-row.interface';
import type { Handbook } from '@/components/TableComponent.vue';

export type ColumnType =
  | 'number'
  | 'string'
  | 'joined'
  | 'computed'
  | 'manage'
  | 'boolean'
  | 'enum'
  | 'date'
  | 'colspan'
  | 'datetime'
  | 'computedText';

export type CollapseTarget = 'first' | 'last' | number;

export type FormatingType = 'default' | 'user' | 'unique';

export type ColumnLookupType<HandbookType extends Handbook> = {
  handbook: HandbookType[];
  displayExpr: keyof HandbookType & string;
  valueExpr: keyof HandbookType & string;
  idExpr: keyof HandbookType & string;
};

export interface Column<
  HandbookType extends Handbook = any,
  RowDataType = any,
  MetaType = any,
> {
  child?: Column<HandbookType, RowDataType, MetaType>[];
  width?: number;
  columnType?: ColumnType;
  caption: string;
  name: string;
  description?: string;
  editable?: boolean;
  rendered?: boolean;
  cssClass?: string;
  trueValue?: string;
  falseValue?: string;
  lookup?: ColumnLookupType<HandbookType>;
  excludeFromColumnChooser?: boolean;
  computing?: {
    value?: (
      rowData: RowDataType,
      column: Column<HandbookType, RowDataType, MetaType>,
      formatEd: number,
      formatRazryad: number,
      meta?: MetaType,
    ) => string;
    editing?: (
      rowData: TableRow<RowDataType>,
      column: Column<HandbookType, RowDataType, MetaType>,
      formatEd: number,
      formatRazryad: number,
      meta?: MetaType,
    ) => boolean;
    cssClass?: (
      rowData: TableRow<RowDataType>,
      column: Column<HandbookType, RowDataType, MetaType>,
      formatEd: number,
      formatRazryad: number,
      meta?: MetaType,
    ) => string;
    grouping?: (
      rowData: TableRow<RowDataType>,
      column: Column<HandbookType, RowDataType, MetaType>,
    ) => number;
  };
  validation?: {
    isReqired?: boolean;
    func?: (
      rowData: RowDataType,
      column: Column<HandbookType, RowDataType, MetaType>,
    ) => { isValid: boolean; message: string };
  };
  collapsing?: {
    collapsable?: boolean;
    collapseTarget?: CollapseTarget;
  };
  templating?: {
    cell?: Component;
    editor?: Component;
    cellHtml?: (
      rowData: RowDataType,
      column: Column<HandbookType, RowDataType, MetaType>,
      formatEd: number,
      formatRazryad: number,
      meta?: MetaType,
    ) => string;
  };
  formating?: {
    type?: FormatingType;
    func?: (
      rowData: RowDataType,
      column: Column<HandbookType, RowDataType, MetaType>,
    ) => string;
    disable: boolean;
  };
  excludeFromTotals?: boolean;
  meta?: any;
  defaultValue?: string | number | boolean;
  allowNullForSelection?: boolean;
  nestedValue?: boolean;
}
