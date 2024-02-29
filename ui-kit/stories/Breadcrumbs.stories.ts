import type { Meta, StoryObj } from '@storybook/vue3';

import Breadcrumbs from '../src/components/Breadcrumbs.vue';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: {
    breadcrumbs: [
      { name: 'Уровень 1', route: '/1' },
      { name: 'Уровень 2', route: '/2' },
      { name: 'Уровень 3', route: '/3' },
    ],

  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Primary: Story = {};
