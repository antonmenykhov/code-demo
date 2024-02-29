import type { Meta, StoryObj } from '@storybook/vue3';

import LabelComponent from '../src/components/LabelComponent.vue';

const meta: Meta<typeof LabelComponent> = {
  title: 'LabelComponent',
  component: LabelComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['default', 'success', 'danger', 'warning'],
    },
  },
  args: {
    type: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof LabelComponent>;

export const Primary: Story = {};
export const WithText: Story = {
  args: {
    text: 'Метка',
    type: 'success',
  },
};
