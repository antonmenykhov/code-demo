import type { Meta, StoryObj } from '@storybook/vue3';

import NavigationComponent from '../src/components/navigation/NavigationComponent.vue';
import DefaultLayout from '../src/components/DefaultLayout.vue';

const meta: Meta<typeof NavigationComponent> = {
  title: 'NavigationComponent',
  component: NavigationComponent,
  tags: ['autodocs'],
  argTypes: {
    navigationItems: {
      description: `Тип

      {
        name: string;
        link?: string | undefined;
        newWindow?: boolean | undefined; - добавит target="_blank"

        external?: boolean | undefined;  - флаг внешней ссылки, отрисует как обычную ссылку, иначе RouterLink
        
        child?: NavigationItem[] | undefined;
        cssClass?: string | undefined;
    }[]
      `,
    },
  },
  args: {
    navigationItems: [
      {
        name: 'Главная',
        link: '/',
      },
      {
        name: 'Опрос',
        link: '/survey',
      },
      {
        name: 'Корректирующие действия',
        link: '/actions',
      },
      {
        name: 'Отчеты',
        child: [
          {
            name: 'Мои ответы',
            link: '/my-answers',
          },
          {
            name: 'КД к моим замечаниям',
            link: '/my-actions',
          },
          {
            name: 'Оценки подразделению',
            link: '/department-answers',
          },
          {
            name: 'КД подразделения',
            link: '/department-actions',
          },
          {
            name: 'Все ответы',
            link: '/all-answers',
          },
          {
            name: 'Все КД',
            link: '/all-actions',
          },
        ],
      },
      {
        name: 'Участники опроса',
        link: '/managment/users',
      },
      {
        name: 'Блоки вопросов',
        link: '/managment/blocks',
      },
      {
        name: 'Периоды проведения',
        link: '/managment/periods',
      },
    ],
  },
  render: (args) => ({
    components: { NavigationComponent, DefaultLayout },
    setup() {
      return { args };
    },
    template: `
    <DefaultLayout>

    <template #side>
    <NavigationComponent v-bind="args" />
    </template>
    <template #main>StoryBook на реакте, не смог отрисовать роутерлинк, а так то норм выглядит</template>

    </DefaultLayout>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `
        <DefaultLayout>

    <template #side>
    <NavigationComponent v-bind="args" />
    </template>
    <template #main>StoryBook на реакте, не смог отрисовать роутерлинк, а так то норм выглядит</template>

    </DefaultLayout>`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationComponent>;

export const Primary: Story = {};
