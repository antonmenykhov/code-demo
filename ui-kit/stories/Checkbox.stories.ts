import type { Meta, StoryObj } from '@storybook/vue3';

import Checkbox from '../src/components/Checkbox.vue';

const meta: Meta<typeof Checkbox> = {
  title: 'Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    value: true,
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {};
