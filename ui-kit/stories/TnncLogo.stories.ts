import type { Meta, StoryObj } from '@storybook/vue3';

import TnncLogo from '../src/components/TnncLogo.vue';

const meta: Meta<typeof TnncLogo> = {
  title: 'TnncLogo',
  component: TnncLogo,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof TnncLogo>;

export const Primary: Story = {};
