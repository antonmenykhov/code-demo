import type { Meta, StoryObj } from '@storybook/vue3';

import TagComponent from '../src/components/TagComponent.vue';

const meta: Meta<typeof TagComponent> = {
  title: 'TagComponent',
  component: TagComponent,
  tags: ['autodocs'],
  args: {
    text: 'Метка',
  },
};

export default meta;
type Story = StoryObj<typeof TagComponent>;

export const Primary: Story = {};

export const WithDeleteButton: Story = {
  args: {
    allowDelete: true,
  },
};
