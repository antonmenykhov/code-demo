import type { Meta, StoryObj } from '@storybook/vue3';

import UploaderInput from '../src/components/UploaderInput.vue';

const meta: Meta<typeof UploaderInput> = {
  title: 'UploaderInput',
  component: UploaderInput,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof UploaderInput>;

export const Primary: Story = {};
