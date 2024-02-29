import type TableColumn from '@/classes/table-column.class';
import type { TableRow } from '@/interfaces/table-row.interface';
import { Workbook, type Worksheet } from 'exceljs';
import type { ComputedRef } from 'vue';
// @ts-ignore
import { saveAs } from 'file-saver-es';
import type { ColumnType } from '@/interfaces/column.interface';

export interface TableColumnExtended extends TableColumn {
  parentColNumber?: number;
}

export default function useExport(
  rows: ComputedRef<TableRow[]>,
  columns: ComputedRef<TableColumnExtended[]>,
  headers: ComputedRef<TableColumnExtended[][]>,
  exportName: ComputedRef<string>,
  propsComputed: ComputedRef<{
    numberFormatingRazryad: number;
  }>,
) {
  //Получает колонки для вывода строк
  const getColsForData = (columns: TableColumn[]) => {
    const getCols = (columns: TableColumn[]) => {
      columns.forEach((column) => {
        if (column.child && column.child.length !== 0) {
          getCols(column.child);
        } else {
          if (column.rendered) cols.push(column);
        }
      });
    };
    let cols: TableColumnExtended[] = [];
    getCols(columns);
    return cols;
  };
  //Получает заголовки для таблицы
  const getColumnHeaders = (columns: TableColumnExtended[]) => {
    let headers: TableColumnExtended[][] = [];
    let maxLevel = 0;

    const setMaxLevel = (columns: TableColumnExtended[], level: number) => {
      columns.forEach((column) => {
        if (column.child && column.child.length !== 0) {
          setMaxLevel(column.child, level + 1);
          maxLevel = maxLevel <= level + 1 ? level + 1 : maxLevel;
        }
      });
    };
    setMaxLevel(columns, 0);
    for (let i = -1; i < maxLevel; i++) {
      headers.push([]);
    }
    const setHeaders = (
      columns: TableColumnExtended[],
      level: number,
      parentColNumber: number,
    ) => {
      let colSpan = 0;
      let parentColSpan = 0;
      columns.forEach((column) => {
        let rowSpan = maxLevel + 1 - level;
        if (column.child && column.child.length > 0) {
          colSpan = setHeaders(column.child, level + 1, parentColNumber);
          parentColSpan += colSpan;
          rowSpan = 1;
        } else {
          if (column.rendered) {
            colSpan = 1;
            parentColSpan += 1;
          } else {
            colSpan = 0;
          }
        }
        if (colSpan > 0) {
          headers[level].push({
            ...column,
            colspan: colSpan,
            rowspan: rowSpan,
            parentColNumber,
          });
          parentColNumber += colSpan;
        }
      });
      return parentColSpan;
    };
    setHeaders(columns, 0, 1);
    return headers;
  };

  const insertHeaders = (
    worksheet: Worksheet,
    columns: TableColumnExtended[],
  ) => {
    const headers = getColumnHeaders(columns);

    headers.forEach((headerRow, rowIndex) => {
      insertHeaderRow(worksheet, headerRow, rowIndex + 1);
    });
    return headers.length;
  };

  const insertHeaderRow = (
    worksheet: Worksheet,
    headerRow: TableColumnExtended[],
    rowIndex: number,
  ) => {
    const row = worksheet.getRow(rowIndex);
    headerRow.forEach((header) => {
      const cell = row.getCell(header.parentColNumber as number);
      cell.value = header.caption;
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      if (header.rowspan > 1 || header.colspan > 1) {
        worksheet.mergeCells(
          rowIndex,
          header.parentColNumber as number,
          rowIndex + header.rowspan - 1,
          (header.parentColNumber as number) + header.colspan - 1,
        );
      }
      if (header.colspan === 1) {
        const column = worksheet.getColumn(header.parentColNumber as number);
        column.width = header.width / 7.37;
      }
    });
  };

  const insertColumnNumbers = (
    worksheet: Worksheet,
    columns: TableColumnExtended[],
    rowIndex: number,
  ) => {
    const cols = getColsForData(columns);
    rowIndex += 1;
    const row = worksheet.getRow(rowIndex);
    cols.forEach((col, index) => {
      const cell = row.getCell(index + 1);
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.value = col.number;
    });
    return rowIndex;
  };

  function getValue(value: string, type: ColumnType) {
    if (value === '(Пусто)' || value === null || value === undefined) return '';
    if (type === 'number') {
      if (value === '(Пусто)') return 0;
      const numbericValue = +`${value}`.split(' ').join('');
      return isFinite(numbericValue) ? numbericValue : '';
    }
    if (type === 'computed') {
      if (value === '(Пусто)') return 0;
      const numbericValue = +`${value}`.split(' ').join('');
      return isFinite(numbericValue) ? numbericValue : value;
    }
    return value;
  }

  function insertDataRows(worksheet: Worksheet, initIndex: number) {
    const cols = getColsForData(columns.value);
    rows.value.forEach((row, index) => {
      const tableRow = worksheet.getRow(initIndex + index + 1);
      cols.forEach((col, columnIndex) => {
        const cell = tableRow.getCell(columnIndex + 1);
        cell.value = getValue(
          row[col.columnType === 'manage' ? '_name' : col.name] as string,
          col.columnType,
        );
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (col.columnType === 'number' || col.columnType === 'computed') {
          cell.numFmt =
            propsComputed.value.numberFormatingRazryad > 0
              ? `#,##0.${'0'.repeat(
                  propsComputed.value.numberFormatingRazryad,
                )}`
              : '#,##0';
        }
      });
    });
    return initIndex + rows.value.length;
  }

  function exportTable() {
    const workbook = new Workbook();
    workbook.creator = 'Сервис УПП';
    const worksheet = workbook.addWorksheet('Лист 1');
    const headerIndex = insertHeaders(worksheet, columns.value);
    const columnNumberIndex = insertColumnNumbers(
      worksheet,
      columns.value,
      headerIndex,
    );
    const rowsIndex = insertDataRows(worksheet, columnNumberIndex);
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], {
          type: 'application/octet-stream',
        }),
        `${exportName.value}.xlsx`,
      );
    });
  }
  return { exportTable };
}
