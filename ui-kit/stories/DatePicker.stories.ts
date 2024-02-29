import type { Meta, StoryObj } from '@storybook/vue3';

import DatePicker from '../src/components/DatePicker.vue';

const meta: Meta<typeof DatePicker> = {
  title: 'DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Primary: Story = {};
