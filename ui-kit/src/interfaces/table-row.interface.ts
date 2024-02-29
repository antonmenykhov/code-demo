export type TableRow<T = any> = T & {
  _name: string;
  _groupedElements: TableRow<T>[];
  _groupedColumnId: string;
  _level: number;
  _rowCssClass: string;
  _rawRow: T;
};
