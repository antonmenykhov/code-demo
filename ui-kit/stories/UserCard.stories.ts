import type { Meta, StoryObj } from '@storybook/vue3';

import UserCard from '../src/components/UserCard.vue';

const meta: Meta<typeof UserCard> = {
  title: 'UserCard',
  component: UserCard,
  tags: ['autodocs'],
  args: {
    imageUrl:
      'https://files.pravda-nn.ru/2020/04/czzle1tweaahjd8.jpg-large.jpeg',
    fullName: 'Бред Иванович Питт',
    size: 'small',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserCard>;

export const Primary: Story = {};
export const LargeSize: Story = {
  args: {
    size: 'large',
  },
};
export const MediumSize: Story = {
  args: {
    size: 'medium',
  },
};
export const SmallSizeExpandableWithButton: Story = {
  args: {
    size: 'small',
    expandable: true,
    showMoreButton: true,
  },
};
