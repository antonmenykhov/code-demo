import type { Meta, StoryObj } from '@storybook/vue3';

import LoaderComponent from '../src/components/LoaderComponent.vue';

const meta: Meta<typeof LoaderComponent> = {
  title: 'LoaderComponent',
  component: LoaderComponent,
  tags: ['autodocs'],
  argTypes: {
    target: {
      description:
        'QuerySelector куда поместить лодаер, например body или #content',
    },
  },
  render: (args) => ({
    components: { LoaderComponent },
    setup() {
      return { args };
    },
    template: `
    <div id="loader-wrapper" style="height:400px"></div>
    <LoaderComponent v-bind="args" />
    `,
  }),
  args: {
    target: '#loader-wrapper',
  },
};

export default meta;
type Story = StoryObj<typeof LoaderComponent>;

export const Primary: Story = {};
