import type { Component } from 'vue';
import type {
  Column,
  ColumnType,
  CollapseTarget,
  FormatingType,
} from '../interfaces/column.interface';
import type { Handbook, Meta } from '@/components/TableComponent.vue';

const defaultCollapseTarget: CollapseTarget = 'first';
// eslint-disable-next-line no-use-before-define

export default class TableColumn implements Column {
  id = '0';

  number = 0;

  rendered = true;

  fixed = false;

  offset = 0;

  width = 100;

  columnType: ColumnType = 'string';

  caption = '';

  name = '';

  description = '';

  child: TableColumn[] = [];

  colspan = 1;

  rowspan = 1;

  editable = false;

  collapsing = {
    collapsed: false,
    collapsable: true,
    collapseTarget: defaultCollapseTarget,
  };

  cssClass?: string = undefined;

  trueValue?: string = undefined;

  falseValue?: string = undefined;

  lookup?: {
    handbook: Handbook[];
    displayExpr: string;
    valueExpr: string;
    idExpr: string;
  };

  computing?: {
    value?: (
      rowData: any,
      column: Column,
      formatEd: number,
      formatRazryad: number,
      meta?: Meta,
    ) => string;
    editing?: (
      rowData: any,
      column: Column,
      formatEd: number,
      formatRazryad: number,
      meta?: Meta,
    ) => boolean;
    cssClass?: (
      rowData: any,
      column: Column,
      formatEd: number,
      formatRazryad: number,
      meta?: Meta,
    ) => string;
    grouping?: (rowData: any[], column: Column) => number;
  };

  validation?: {
    isReqired?: boolean;
    func?: (
      rowData: any,
      column: Column,
    ) => { isValid: boolean; message: string };
  };

  templating?: {
    cell?: Component;
    editor?: Component;
    cellHtml?: (
      rowData: any,
      column: Column,
      formatEd: number,
      formatRazryad: number,
      meta?: any,
    ) => string;
  };

  formating?: {
    type?: FormatingType;
    func?: (rowData: any, column: Column) => string;
    disable: boolean;
  };

  meta? = undefined;

  excludeFromTotals?: boolean;

  defaultValue?: string | number | boolean;

  excludeFromColumnChooser?: boolean;

  allowNullForSelection?: boolean;

  nestedValue?: boolean | undefined;

  constructor(configColumn: Partial<Column>) {
    const {
      caption,
      name,
      width,
      columnType,
      collapsing,
      computing,
      falseValue,
      trueValue,
      templating,
      excludeFromTotals,
      editable,
      lookup,
      formating,
      child,
      cssClass,
      validation,
      meta,
      defaultValue,
      description,
      rendered,
      excludeFromColumnChooser,
      allowNullForSelection,
      nestedValue,
    } = configColumn;
    this.caption = caption || this.caption;
    this.name = name || this.name;
    this.width = width || this.width;
    this.columnType = columnType || this.columnType;
    this.collapsing = { ...this.collapsing, ...collapsing };
    this.computing = computing;
    this.falseValue = falseValue;
    this.trueValue = trueValue;
    this.templating = templating;
    this.rendered = rendered !== undefined ? rendered : this.rendered;
    this.excludeFromTotals = excludeFromTotals;
    this.editable = editable || this.editable;
    this.lookup = lookup;
    this.formating = formating;
    this.child = child?.map((ch) => new TableColumn(ch)) || [];
    this.cssClass = cssClass;
    this.validation = validation;
    this.meta = meta;
    this.defaultValue = defaultValue;
    this.description = description || this.caption;
    this.excludeFromColumnChooser = excludeFromColumnChooser;
    this.allowNullForSelection = allowNullForSelection;
    this.nestedValue = nestedValue;
  }
}
