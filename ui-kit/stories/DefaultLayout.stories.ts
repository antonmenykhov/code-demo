import type { Meta, StoryObj } from '@storybook/vue3';

import DefaultLayout from '../src/components/DefaultLayout.vue';

const meta: Meta<typeof DefaultLayout> = {
  title: 'DefaultLayout',
  component: DefaultLayout,
  tags: ['autodocs'],
  argTypes: {
    visibleStateDefault: {
      description: 'Начальное состояние сайдбара (не реактивно!)',
    },
    side: {
      description: 'Слот для сайдбара',
    },
    main: {
      description: 'Слот для основного контента',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DefaultLayout>;

export const Primary: Story = {};
