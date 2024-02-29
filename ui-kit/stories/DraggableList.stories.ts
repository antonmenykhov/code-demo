import type { Meta, StoryObj } from '@storybook/vue3';

import DraggableList from '../src/components/DraggableList.vue';

const meta: Meta<typeof DraggableList> = {
  parameters: {
    docs: {
      source: {
        code: `
        <template>
  <DraggableList v-bind="computedArgs">
    <template #listItem={listItem}>{{listItem.name}}</template>
  </DraggableList>
</template>`,
      },
    },
  },
  title: 'DraggableList',
  component: DraggableList,
  tags: ['autodocs'],
  argTypes: {
    availableListNames: {
      description:
        'Массив названий листов куда можно перетащить элементы из текущего листа',
    },
    listItem: {
      description: `Слот для рендера элементов. В примере:
      
      <template #listItem={listItem}>
        {{listItem.name}}
      </template>`,
    },
    onDragging: {
      description: `Эмитится событие
      
      {
        oldIndex: number;
        oldList: string;
        newIndex: number;
        newList: string;
      }
      `,
    },
  },
  args: {
    items: [
      {
        id: '1',
        name: 'Элемент 1',
      },
      {
        id: '2',
        name: 'Элемент 2',
      },
      {
        id: '3',
        name: 'Элемент 3',
      },
      {
        id: '4',
        name: 'Элемент 4',
      },
    ],
    listName: 'list',
  },
  render: (args) => ({
    computed: {
      computedArgs() {
        return args;
      },
    },
    components: { DraggableList },
    template: `<DraggableList v-bind="computedArgs">
    <template #listItem={listItem}>{{listItem.name}}</template>
    </DraggableList>`,
  }),
};

export default meta;
type Story = StoryObj<typeof DraggableList>;

export const Primary: Story = {};
