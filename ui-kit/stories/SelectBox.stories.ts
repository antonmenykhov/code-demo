import type { Meta, StoryObj } from '@storybook/vue3';

import SelectBox from '../src/components/SelectBox.vue';

const meta: Meta<typeof SelectBox> = {
  title: 'SelectBox',
  component: SelectBox,
  tags: ['autodocs'],
  args: {
    options: ['Опция 1', 'Опция 2', 'Опция 3'],
    value: 'Опция 1',
    label: 'Селектбокс',
  },
  argTypes: {
    valueType: {
      control: 'radio',
      options: ['primitive', 'object'],
      description:
        'Тип object Позволяет использовать объект целиком как значение',
    },
    displayExpr: {
      description:
        'В случае если опции объект - повзоляет указать название поля для отображения (name)',
    },
    valueExpr: {
      description:
        'В случае если опции объект - повзоляет указать название поля для значения (id)',
    },
    optionCssClass: {
      description: 'css класс для выпадающего списка',
    },
    isTree: {
      description:
        'Позволяет рекрсивно отрисовать чайлды каждой опции из свойства child. Таким образом получается древовидная структура',
    },
    buttonMode: {
      description: 'Позволяет заменить инпут на кнопку',
    },
    optionsWidth: {
      description:
        'По умолчанию ширина выпадающего списка равна ширине родительского инпута, в данном свойстве можно принудительно задать любую ширину в пикселях',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectBox>;

export const PlainArray: Story = {};
export const ObjectArray: Story = {
  args: {
    options: [
      {
        id: 1,
        name: 'Опция 1',
      },
      {
        id: 2,
        name: 'Опция 2',
      },
      {
        id: 3,
        name: 'Опция 3',
      },
    ],
    value: 1,
    displayExpr: 'name',
    valueExpr: 'id',
    label: 'Селектбокс',
  },
};
export const ObjectArrayWithTypeObject: Story = {
  args: {
    ...ObjectArray.args,
    value: {
      id: 2,
      name: 'Опция 2',
    },
    valueType: 'object',
  },
};
export const TreeObject: Story = {
  args: {
    label: 'Древовидный селектбокс',
    value: 3,
    isTree: true,
    displayExpr: 'name',
    valueExpr: 'id',
    options: [
      {
        id: 1,
        name: 'Опция 1',
        child: [
          {
            id: 4,
            name: 'Опция 1_1',
          },
          {
            id: 5,
            name: 'Опция 1_2',
          },
        ],
      },
      {
        id: 2,
        name: 'Опция 2',
      },
      {
        id: 3,
        name: 'Опция 3',
        child: [
          {
            id: 6,
            name: 'Опция 3_1',
          },
          {
            id: 7,
            name: 'Опция 3_2',
          },
        ],
      },
    ],
  },
};
export const TreeObjectMultiply: Story = {
  args: {
    ...TreeObject.args,
    value: [1, 4],
  },
};
