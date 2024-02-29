import type { Meta, StoryObj } from '@storybook/vue3';
import TextInput from '../src/components/TextInput.vue';

const meta: Meta<typeof TextInput> = {
  title: 'TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['text', 'number'],
      description:
        'Тип поля, при number ввод фильтруется (свойство используется для компонента NumberInput)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Primary: Story = {};
export const WithSlots: Story = {
  render: () => ({
    template: `<TextInput label="Инпут со слотами" value=""> 
       <template #prefix><i class="fa-solid fa-pen" /></template> 
       <template #suffix><i class="fa-solid fa-car" /></template> 
      </TextInput>`,
    components: { TextInput },
  }),
};
export const InvalidState: Story = {
  args: {
    invalid: true,
    invalidText: 'Сообщение об ошибке',
    value: '',
  },
};
