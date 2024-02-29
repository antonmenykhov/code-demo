import type { Meta, StoryObj } from '@storybook/vue3';
import TextAreaInput from '../src/components/TextAreaInput.vue';

const meta: Meta<typeof TextAreaInput> = {
  title: 'TextAreaInput',
  component: TextAreaInput,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    value: '',
  },
};

export default meta;
type Story = StoryObj<typeof TextAreaInput>;

export const Primary: Story = {
  args: {
    value: '',
  },
};
export const InvalidState: Story = {
  args: {
    invalid: true,
    invalidText: 'Сообщение об ошибке',
    value: '',
  },
};
