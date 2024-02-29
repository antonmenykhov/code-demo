import type { Meta, StoryObj } from '@storybook/vue3';

import Paginator from '../src/components/Paginator.vue';

const meta: Meta<typeof Paginator> = {
  title: 'Paginator',
  component: Paginator,
  tags: ['autodocs'],
  args: {
    value: 1,
    maxValue: 10,
  },
};

export default meta;
type Story = StoryObj<typeof Paginator>;

export const Primary: Story = {};
