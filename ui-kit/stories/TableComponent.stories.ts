import type { Meta, StoryObj } from '@storybook/vue3';
import TableComponentMdx from './TableComponent.mdx';

import TableComponent from '../src/components/TableComponent.vue';

const meta: Meta<typeof TableComponent> = {
  title: 'TableComponent',
  component: TableComponent,
  tags: ['autodocs'],
  args: {
    columns: [
      {
        name: 'id',
        caption: 'id',
        columnType: 'string',
      },
      {
        name: 'name',
        caption: 'Название',
        columnType: 'string',
      },
    ],
    rows: [
      {
        id: 1,
        name: 'Позиция 1',
      },
      {
        id: 2,
        name: 'Позиция 2',
      },
      {
        id: 3,
        name: 'Позиция 3',
      },
      {
        id: 4,
        name: 'Позиция 4',
      },
    ],
    allowFilter: true,
    allowToolbar: true,
  },
  argTypes: {
    columns: {
      description: 'Смотри описание интерфейса Column ниже',
    },
    totals: {
      description: 'Смотри описание типа TableTotal ниже',
    },
    headerTotals: {
      description: 'Смотри описание типа TableTotal ниже',
    },
    keyExpr: {
      description: 'Поле в строке, уникальное для каждой строки (id)',
    },
    allowExpand: {
      description: 'Аналог masterDetail в devExtreme',
    },
    numberFormatingEd: {
      description:
        'Используется при форматировании числовых значений, значение умнажается на этот параметр',
    },
    numberFormatingRazryad: {
      description:
        'Используется при форматировании числовых значений, кол-во знаков после запятой',
    },
    expanderTemplate: {
      description: 'Компонент для masterDetail',
    },
    expandablePropertyName: {
      description:
        'Название boolean-значения в строке. В случае если оно true иконка expander подкрасится в другой цвет',
    },
    customManageButtons: {
      description: 'Смотри описание типа CustomManageButton ниже',
    },
    hideZeroNumbers: {
      description: 'Скрывает нули для числовых значений',
    },
    autosaveRow: {
      description:
        'Если true то при октрытии новой строки на редактирование предидущая вызовет метод save',
    },
    groupRowsDefaultStateOpened: {
      description:
        'Начальное состояние сгруппированных строк, если true  - то строки развернуты',
    },
    rowTemplate: {
      description: 'Компонент для рендера строк таблицы',
    },
  },
  parameters: {
    docs: {
      page: TableComponentMdx,
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableComponent>;

export const Primary: Story = {};
