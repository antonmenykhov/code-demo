import type { Meta, StoryObj } from '@storybook/vue3';

import Toggle from '../src/components/Toggle.vue';

const meta: Meta<typeof Toggle> = {
  title: 'Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Primary: Story = {};
