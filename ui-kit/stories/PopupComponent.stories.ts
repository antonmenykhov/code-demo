import type { Meta, StoryObj } from '@storybook/vue3';

import PopupComponent from '../src/components/PopupComponent.vue';
import ButtonComponent from '../src/components/ButtonComponent.vue';
import { ref } from 'vue';

const meta: Meta<typeof PopupComponent> = {
  title: 'PopupComponent',
  component: PopupComponent,
  tags: ['autodocs'],
  render: (args) => ({
    setup() {
      const visible = ref(false);
      return { args, visible };
    },
    components: { PopupComponent, ButtonComponent },
    template: `<ButtonComponent text="Открыть попап" @click="()=>{visible = !visible}" />
    <PopupComponent v-bind="args" v-model:visible="visible" />
    `,
  }),
  args: {
    title: 'Демо попап',
  },
};

export default meta;
type Story = StoryObj<typeof PopupComponent>;

export const Primary: Story = {};
