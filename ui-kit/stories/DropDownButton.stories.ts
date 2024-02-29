import type { Meta, StoryObj } from '@storybook/vue3';

import DropDownButton from '../src/components/DropDownButton.vue';

const meta: Meta<typeof DropDownButton> = {
  title: 'DropDownButton',
  component: DropDownButton,
  tags: ['autodocs'],
  args: {
    text: 'Открыть',
  },
  render: (args) => ({
    components: { DropDownButton },
    setup() {
      return { args };
    },
    template: `<DropDownButton v-bind="args">Содержимое списка</DropDownButton>`,
  }),
};

export default meta;
type Story = StoryObj<typeof DropDownButton>;

export const Primary: Story = {};
