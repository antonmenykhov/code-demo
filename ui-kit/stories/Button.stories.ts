import type { Meta, StoryObj } from '@storybook/vue3';

import ButtonComponent from '../src/components/ButtonComponent.vue';

const meta: Meta<typeof ButtonComponent> = {
  title: 'ButtonComponent',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    cssClass: { description: 'Произвольный класс для кнопки' },
    type: {
      control: 'radio',
      options: ['default', 'danger', 'success'],
      description: 'Тип кнопки default | danger | success',
    },
    iconClass: {
      description:
        'Класс иконки кнопки, например из fontAwesome (fa-solid fa-close)',
    },
    reverse: {
      description: 'Меняет текст и иконку местами',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonComponent>;

export const Primary: Story = {
  args: {
    text: 'Стандартная кнопка',
  },
};
export const Success: Story = {
  args: {
    type: 'success',
    text: 'Зеленая кнопка',
  },
};

export const Danger: Story = {
  args: {
    type: 'danger',
    text: 'Красная кнопка',
  },
};

export const WithIcon: Story = {
  args: {
    text: 'Кнопка с иконкой',
    iconClass: 'fa-solid fa-pen',
  },
};

export const Disabled: Story = {
  args: {
    text: 'Отключенная кнопка',
    disabled: true,
  },
};
