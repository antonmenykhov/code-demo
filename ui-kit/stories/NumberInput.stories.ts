import type { Meta, StoryObj } from '@storybook/vue3';
import NumberInput from '../src/components/NumberInput.vue';

const meta: Meta<typeof NumberInput> = {
  title: 'NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Primary: Story = {};
export const WithSlots: Story = {
  render: () => ({
    template: `<NumberInput label="Инпут со слотами" value=""> 
       <template #prefix><i class="fa-solid fa-pen" /></template> 
       <template #suffix><i class="fa-solid fa-car" /></template> 
      </NumberInput>`,
    components: { NumberInput },
  }),
};
export const InvalidState: Story = {
  args: {
    invalid: true,
    invalidText: 'Сообщение об ошибке',
    value: 0,
  },
};
