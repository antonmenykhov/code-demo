import type { Meta, StoryObj } from '@storybook/vue3';

import ContextMenu from '../src/components/ContextMenu.vue';
import { type Ref, ref } from 'vue';

const meta: Meta<typeof ContextMenu> = {
  title: 'ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  render: () => ({
    setup() {
      const mouseEvent: Ref<MouseEvent | null> = ref(null);
      return { mouseEvent };
    },
    components: { ContextMenu },
    template: `
    <div @contextmenu="(e)=>{mouseEvent=e; e.preventDefault()}"> Клик ПКМ </div>
    <ContextMenu @clickOutside="()=>{mouseEvent=null}" v-if="mouseEvent" :mouseEvent="mouseEvent" >Содержание конктекстного меню</ContextMenu>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `
        <template>
<div @contextmenu="(e)=>{mouseEvent=e; e.preventDefault()}"> Клик ПКМ </div>
<ContextMenu @clickOutside="()=>{mouseEvent=null}" v-if="mouseEvent" :mouseEvent="mouseEvent" >Содержание конктекстного меню</ContextMenu>
</template>
<script lang="ts" setup> 
const mouseEvent: Ref<MouseEvent | null> = ref(null);
</srcipt>
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Primary: Story = {};
