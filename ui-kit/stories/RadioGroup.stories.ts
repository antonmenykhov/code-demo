import type { Meta, StoryObj } from '@storybook/vue3';

import RadioGroup from '../src/components/RadioGroup.vue';

const meta: Meta<typeof RadioGroup> = {
  title: 'RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: `
      
      {

        label: string;

        value: string;

        disabled?: boolean | undefined;

        cssClass?: string | undefined;

    }[] `
    }
  },
  args: {
    options: [
      {
        label: 'Метка 1',
        value: 'Значение 1',
      },
      {
        label: 'Метка 2',
        value: 'Значение 2',
      },
      {
        label: 'Метка 3',
        value: 'Значение 3',
      },
      {
        label: 'Метка 4',
        value: 'Значение 4',
        disabled: true,
      },
    ],
    value: 'Значение 2',
    groupName: 'test',
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Primary: Story = {};
