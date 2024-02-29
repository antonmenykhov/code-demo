<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue';
import type TableColumn from './classes/table-column.class';
import Breadcrumbs from './components/Breadcrumbs.vue';
import ButtonComponent from './components/ButtonComponent.vue';
import Checkbox from './components/Checkbox.vue';
import LabelComponent from './components/LabelComponent.vue';
import Paginator from './components/Paginator.vue';
import RadioGroup from './components/RadioGroup.vue';
import SelectBox from './components/SelectBox.vue';
import TableComponent, {
  type TableTotal,
} from './components/TableComponent.vue';
import TagComponent from './components/TagComponent.vue';
import TextAreaInput from './components/TextAreaInput.vue';
import TextInput from './components/TextInput.vue';
import Toggle from './components/Toggle.vue';
import UserCard from './components/UserCard.vue';
import type { TableRow } from './interfaces/table-row.interface';
import columns from './tprColumns/tprEco';
import DatePicker from './components/DatePicker.vue';
import LoaderComponent from './components/LoaderComponent.vue';
import TnncLoader from './components/TnncLoader.vue'
import DraggableList from './components/DraggableList.vue';
import PopupComponent from './components/PopupComponent.vue';
import DefaultLayout from './components/DefaultLayout.vue';
import TnncLogo from './components/TnncLogo.vue';
import { confirm } from './services/confirm.service';
import type { NavigationItem } from './components/navigation/NavigationComponent.vue';
import NavigationComponent from './components/navigation/NavigationComponent.vue';
import NumberInput from './components/NumberInput.vue';
import { notify } from './services/notify.service';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import DropDownButton from './components/DropDownButton.vue';

type Breadcrumb = {
  name: string;
  route: string;
};

const breadcrumbs: Breadcrumb[] = [
  {
    name: 'Главная',
    route: '/',
  },
  {
    name: 'Новости',
    route: '/',
  },
  {
    name: 'Заголовок',
    route: '/',
  },
];
const textInputValue = ref('');
const textAreaValue = ref('');
const checkboxValue = ref(true);
const radioGroupValue = ref('Radio 1');
const radioGroupOptions: {
  label: string;
  value: string;
  disabled?: boolean;
}[] = [
  { label: 'Radio 1', value: 'Radio 1' },
  { label: 'Radio 2', value: 'Radio 2' },
  { label: 'Radio 3', value: 'Radio 3', disabled: true },
];
const toggleValue = ref(true);
const paginatorValue = ref(1);
function onClick() {
  alert('Кнопка нажата');
}
function cardClicked() {
  alert('Клик по профилю');
}
function moreBtnClicked() {
  alert('Клик по кнопке профиля');
}
const selectBoxValue = ref(3);
const selectBox2Value = ref([
  {
    id: 1,
    name: 'Вариант 1',
  },
  {
    id: 2,
    name: 'Вариант 2',
  },
]);
const selectBoxOptions = ref([
  {
    id: 1,
    name: 'Опция 1',
    child: [
      {
        id: 4,
        name: 'Опция 1_1',
      },
      {
        id: 5,
        name: 'Опция 1_2',
      },
    ],
  },
  {
    id: 2,
    name: 'Опция 2',
  },
  {
    id: 3,
    name: 'Опция 3',
    child: [
      {
        id: 6,
        name: 'Опция 3_1',
      },
      {
        id: 7,
        name: 'Опция 3_2',
      },
    ],
  },
]);

const rows = ref([]);
onMounted(async () => {
  rows.value = await (await fetch('rowForTable.json')).json();
});
const number = ref(0);
const toggleForRows = ref(true);
const rowsForTable = computed(() => (toggleForRows.value ? rows.value : []));
const totals: TableTotal[] = [
  {
    name: 'Всего',
    function: (
      column: TableColumn,
      rows: TableRow[],
      ed: number,
      razryad: number,
    ) => {
      const value = rows.reduce((acc, row) => {
        return (acc +=
          row[column.name] === '(Пусто)'
            ? 0
            : +`${row[column.name]}`.split(' ').join(''));
      }, 0);

      return `${isNaN(value) ? '' : value}`;
    },
  },
];

const table = ref(null);
function externalManaging() {
  if (table.value) {
    // @ts-ignore
    table.value.renderedColumnsIds.splice(1, 1);
  }
}
function reorderRows(item: { oldIndex: number; newIndex: number }) {
  const { newIndex, oldIndex } = item;
  rows.value.splice(newIndex, 0, ...rows.value.splice(oldIndex, 1));
}

const date = ref('2022-10-09T01:01:01Z');
const date2 = ref('2022-10-09T01:01:01Z');
function testConfirm() {
  confirm('Тестовое сообщение')
    .then(() => {})
    .catch(() => {});
}
const popupVisible = ref(false);

const navItems = ref<NavigationItem[]>([
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
    name: 'Это очень длинное название в меню',
    link: '/actions',
  },
  {
    name: 'Отчеты',
    child: [
      {
        name: 'Мои ответы',
        link: '/',
        visible: false,
      },
      {
        name: 'КД к моим замечаниям',
        link: '/my-actions',
        visible: true,
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
]);

const emitNotify = () => {
  notify('Тест', 'success', 10000);
};
const emitNotify5 = () => {
  notify('Тест', 'success', 5000);
};
function showPopup() {
  popupVisible.value = true;
}

const versions = ref([
  {
    admin_user_id: 43,
    comment: null,
    date_end: '2024-02-25T19:00:00',
    deleted: false,
    deleted_by: null,
    id: 52,
    is_actual: true,
    modified_by: null,
    name: '\u041f\u0420 20.02.',
    'user.deleted': false,
    'user.deleted_by': null,
    'user.email_address': null,
    'user.fio':
      '\u0412\u043e\u0440\u043e\u0431\u044c\u0435\u0432\u0430 \u0415\u043a\u0430\u0442\u0435\u0440\u0438\u043d\u0430 \u0413\u0435\u043d\u043d\u0430\u0434\u044c\u0435\u0432\u043d\u0430',
    'user.modified_by': 'egvorobyeva',
    'user.send_messages': true,
    'user.sr_id': 'b1f9b3cc-4274-436d-870f-a6392246c0bb',
    'user.user_role.user_role_name':
      '\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440',
    'user.user_role_id': 1,
    'user.username': 'egvorobyeva',
    version_status_id: null,
  },
  {
    admin_user_id: 43,
    comment: null,
    date_end: '2024-02-22T19:00:00',
    deleted: false,
    deleted_by: null,
    id: 53,
    is_actual: false,
    modified_by: null,
    name: '\u0411\u041f \u0441\u043a\u043e\u0440\u0440',
    'user.deleted': false,
    'user.deleted_by': null,
    'user.email_address': null,
    'user.fio':
      '\u0412\u043e\u0440\u043e\u0431\u044c\u0435\u0432\u0430 \u0415\u043a\u0430\u0442\u0435\u0440\u0438\u043d\u0430 \u0413\u0435\u043d\u043d\u0430\u0434\u044c\u0435\u0432\u043d\u0430',
    'user.modified_by': 'egvorobyeva',
    'user.send_messages': true,
    'user.sr_id': 'b1f9b3cc-4274-436d-870f-a6392246c0bb',
    'user.user_role.user_role_name':
      '\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440',
    'user.user_role_id': 1,
    'user.username': 'egvorobyeva',
    version_status_id: null,
  },
  {
    admin_user_id: 43,
    comment: null,
    date_end: '2023-12-28T00:00:00',
    deleted: false,
    deleted_by: null,
    id: 50,
    is_actual: false,
    modified_by: 'egvorobyeva',
    name: '\u0411\u041f',
    'user.deleted': false,
    'user.deleted_by': null,
    'user.email_address': null,
    'user.fio':
      '\u0412\u043e\u0440\u043e\u0431\u044c\u0435\u0432\u0430 \u0415\u043a\u0430\u0442\u0435\u0440\u0438\u043d\u0430 \u0413\u0435\u043d\u043d\u0430\u0434\u044c\u0435\u0432\u043d\u0430',
    'user.modified_by': 'egvorobyeva',
    'user.send_messages': true,
    'user.sr_id': 'b1f9b3cc-4274-436d-870f-a6392246c0bb',
    'user.user_role.user_role_name':
      '\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440',
    'user.user_role_id': 1,
    'user.username': 'egvorobyeva',
    'version_status.deleted': false,
    'version_status.deleted_by': null,
    'version_status.modified_by': null,
    'version_status.name':
      '\u0421\u0431\u043e\u0440 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d',
    version_status_id: 3,
  },
]);

const versionValue = ref(52);
</script>

<template>
  <DefaultLayout>
    <template #side>
      <TnncLogo :newYearLogo="true" link="/tnnc" />
      <NavigationComponent :navigation-items="navItems" />
    </template>
    <template #main>
      <!-- <TnncLoader target="main" /> -->
      <h1>Типографика</h1>
      <h1>Заголовок 1</h1>
      <h2>Заголовок 2</h2>
      <h3>Заголовок 3</h3>
      <h4>Заголовок 4</h4>
      <h5>Заголовок 5</h5>
      <h6>Заголовок 6</h6>
      <h2>Выделение</h2>
      <h3>
        Равным образом
        <mark
          >выбранный нами инновационный путь обеспечивает широкому кругу</mark
        >
        специалистов.
      </h3>
      <h2>Абзац</h2>
      <p>
        Как уже неоднократно упомянуто, предприниматели в сети интернет
        призывают нас к новым свершениям, которые, в свою очередь, должны быть
        представлены в исключительно положительном свете. Прежде всего,
        укрепление и развитие внутренней структуры в значительной степени
        обусловливает важность глубокомысленных рассуждений. И нет сомнений, что
        многие известные личности, превозмогая сложившуюся непростую
        экономическую ситуацию, указаны как претенденты на роль ключевых
        факторов. А также элементы политического процесса набирают популярность
        среди определенных слоев населения, а значит, должны быть указаны как
        претенденты на роль ключевых факторов. Безусловно, постоянное
        информационно-пропагандистское обеспечение нашей деятельности не
        оставляет шанса для инновационных методов управления процессами.
        Принимая во внимание показатели успешности, укрепление и развитие
        внутренней структуры, в своём классическом представлении, допускает
        внедрение прогресса профессионального сообщества. Высокий уровень
        вовлечения представителей целевой аудитории является четким
        доказательством простого факта: повышение уровня гражданского сознания
        требует анализа направлений прогрессивного развития. Противоположная
        точка зрения подразумевает, что предприниматели в сети интернет могут
        быть смешаны с не уникальными данными до степени совершенной
        неузнаваемости, из-за чего возрастает их статус бесполезности. Имеется
        спорная точка зрения, гласящая примерно следующее: тщательные
        исследования конкурентов освещают чрезвычайно интересные особенности
        картины в целом, однако конкретные выводы, разумеется, подвергнуты целой
        серии независимых исследований. В своём стремлении повысить качество
        жизни, они забывают, что базовый вектор развития способствует подготовке
        и реализации направлений прогрессивного развития. Не следует, однако,
        забывать, что граница обучения кадров требует анализа глубокомысленных
        рассуждений.
      </p>
      <h2>Цитата</h2>
      <q
        >Прежде всего, перспективное планирование однозначно фиксирует
        необходимость экспериментов, поражающих по своей масштабности и
        грандиозности. Противоположная точка зрения подразумевает, что
        непосредственные участники технического прогресса будут рассмотрены
        исключительно в разрезе маркетинговых и финансовых предпосылок.</q
      >
      <h2>Хлебные крошки</h2>
      <Breadcrumbs :breadcrumbs="breadcrumbs" />
      <h2>Текстовые поля</h2>
      <NumberInput
        :mask="maskitoNumberOptionsGenerator()"
        v-model:value="number"
      />
      <NumberInput
        :mask="maskitoNumberOptionsGenerator()"
        v-model:value="number"
      />
      <TextInput
        disabled
        v-model:value="textInputValue"
        label="Метка"
        css-class="input-class"
      />
      <TextInput
        v-model:value="textInputValue"
        label="Метка"
        css-class="input-class"
        show-clear-button
        invalid
        invalid-text="Тестовое сообщение"
      />
      <TextAreaInput
        v-model:value="textAreaValue"
        label="Метка"
        :max-length="50"
        css-class="input-class"
        autosize
        :rows="1"
      />
      <TextAreaInput
        v-model:value="textAreaValue"
        label="Метка"
        :max-length="50"
        css-class="input-class"
        invalid
        invalid-text="Тестовое сообщение"
      />
      <TextAreaInput
        v-model:value="textAreaValue"
        label="Метка"
        :max-length="50"
        css-class="input-class"
        disabled
      />
      <h2>Ссылки</h2>
      <a href="http://72.ru">Default</a>
      <h2>Селекторы</h2>
      <Checkbox
        v-model:value="checkboxValue"
        label="Checkbox"
        css-class="width200px"
      />
      <Checkbox
        v-model:value="checkboxValue"
        label="Checkbox disabled"
        css-class="width200px"
        :disabled="true"
      />
      <RadioGroup
        group-name="test"
        v-model:value="radioGroupValue"
        :options="radioGroupOptions"
        radio-button-css-class="width200px"
      />
      <Toggle
        v-model:value="toggleValue"
        label="Toggle"
        css-class="width200px"
        vertical
      />
      <Toggle
        v-model:value="toggleValue"
        label="Toggle disabled"
        css-class="width200px"
        disabled
      />
      <DropDownButton text="Дропдаун">
        <Toggle
          v-model:value="toggleValue"
          label="Toggle"
          css-class="width200px"
        />
        <Toggle
          v-model:value="toggleValue"
          label="Toggle disabled"
          css-class="width200px"
          disabled
        />
      </DropDownButton>
      <h2>Кнопки</h2>
      <ButtonComponent
        css-class="width200px"
        text="Button"
        @on-click="onClick"
      />
      <ButtonComponent
        css-class="width200px"
        text="Button Icon"
        icon-class="fa-solid fa-arrow-right"
        @on-click="onClick"
      />
      <ButtonComponent
        css-class="width200px"
        icon-class="fa-solid  fa-arrow-right"
        @on-click="onClick"
      />
      <ButtonComponent
        css-class="width200px"
        icon-class="fa-solid  fa-arrow-right"
        type="danger"
        text="Button Icon"
        @on-click="onClick"
      />
      <ButtonComponent
        css-class="width200px"
        icon-class="fa-solid  fa-arrow-right"
        @on-click="onClick"
        type="success"
        text="Button Icon"
      />
      <ButtonComponent
        css-class="width200px"
        text="Button Disabled"
        icon-class="fa-solid  fa-arrow-right"
        disabled
        @on-click="onClick"
      />
      <h2>Тэги и метки</h2>
      <LabelComponent css-class="width200px" type="default" />
      <LabelComponent css-class="width200px" type="success" />
      <LabelComponent css-class="width200px" type="danger" />
      <LabelComponent css-class="width200px" type="warning" />
      <LabelComponent css-class="width200px" text="default" type="default" />
      <LabelComponent css-class="width200px" text="success" type="success" />
      <LabelComponent css-class="width200px" text="danger" type="danger" />
      <LabelComponent css-class="width200px" text="warning" type="warning" />
      <TagComponent css-class="width200px" text="Tag" />
      <TagComponent css-class="width200px" text="Tag" allow-delete />
      <h2>Слайдер</h2>
      <Paginator :max-value="6" v-model:value="paginatorValue" />
      <h2>Пользователь</h2>
      <UserCard
        cssClass="margin5"
        full-name="Фамилия Имя Отчетство"
        first-name="Имя"
        image-url="http://tmn-tnnc-webapp/tnnc/PublishingImages/login.png"
      />
      <UserCard
        cssClass="margin5"
        full-name="Фамилия Имя Отчетство"
        first-name="Имя"
        image-url="http://tmn-tnnc-webapp/tnnc/PublishingImages/login.png"
        size="medium"
      />
      <UserCard
        cssClass="margin5"
        full-name="Фамилия Имя Отчетство"
        first-name="Имя"
        image-url="http://tmn-tnnc-webapp/tnnc/PublishingImages/login.png"
        size="small"
      />
      <UserCard
        cssClass="margin5"
        full-name="Фамилия Имя Отчетство"
        first-name="Имя"
        image-url="http://tmn-tnnc-webapp/tnnc/PublishingImages/login.png"
        show-more-button
      />
      <UserCard
        cssClass="margin5"
        full-name="Фамилия Имя Отчетство"
        first-name="Имя"
        image-url="http://tmn-tnnc-webapp/tnnc/PublishingImages/login.png"
        show-more-button
        expandable
        size="small"
      />
      <UserCard
        cssClass="margin5"
        full-name="Фамилия Имя Отчетство"
        first-name="Имя"
        image-url="http://tmn-tnnc-webapp/tnnc/PublishingImages/login.png"
        show-more-button
        expandable
        size="medium"
        @card-clicked="cardClicked"
        @more-btn-clicked="moreBtnClicked"
      />
      <h2>Выпадающий список</h2>
      {{ selectBoxValue }}
      <SelectBox
        label="Метка"
        v-model:value="selectBoxValue"
        :options="selectBoxOptions"
        display-expr="name"
        value-expr="id"
        css-class="width200px "
        :is-tree="true"
      />
      <SelectBox
        label="Метка"
        v-model:value="selectBox2Value"
        :options="selectBoxOptions"
        display-expr="name"
        value-expr="id"
        css-class="width200px "
        :show-clear-button="true"
        allow-search
        value-type="object"
      />
      <Toggle
        v-model:value="toggleForRows"
        label="Вкл выкл строки"
        css-class="width200px"
      />
      <ButtonComponent text="111" @click="externalManaging" />
      <TableComponent
        ref="table"
        :columns="columns"
        css-class="table"
        :rows="rowsForTable"
        key-expr="ID"
        :allowToolbar="true"
        :allow-column-numeration="true"
        :allow-filter="true"
        :allow-edit="true"
        :allow-add="true"
        :allow-export="true"
        :allow-reordering="true"
        allow-grouping
        :column-chooser="true"
        allow-pagination
        allow-sorting
        allow-fixing
        group-rows-default-state-opened
        @reordering="reorderRows"
        :header-totals="totals"
        show-group-counter
        show-total-counter
        show-loader
        additional-features
        manage-column-name="Кнопки"
        popup-editor
        @settings-changed="
          (e) => {
            console.log(e);
          }
        "
      >
        <template #toolbar-left>
          <SelectBox
            label="Версии для сравнения"
            :options="versions"
            display-expr="name"
            value-expr="id"
            v-model:value="versionValue"
            css-class="fixed-width"
          />
          <SelectBox
            label="Метка"
            v-model:value="selectBoxValue"
            :options="selectBoxOptions"
            display-expr="name"
            value-expr="id"
            css-class="width200px "
            :is-tree="true"
          />
        </template>
      </TableComponent>
      {{ date }}
      {{ date2 }}
      <DatePicker v-model:value="date" :max-value="date2" />
      <DatePicker
        v-model:value="date2"
        :min-value="date"
        show-clear-button
        with-time
      />

      <ButtonComponent
        text="Вызвать диалог"
        @click="testConfirm"
      ></ButtonComponent>
      <ButtonComponent
        @click="showPopup"
        text="Показать попап"
      ></ButtonComponent>
      <PopupComponent
        close-on-outside-click
        title="заголовок попапа"
        v-model:visible="popupVisible"
      >
        <DraggableList
          listName="list1"
          :items="[1, 2, 3]"
          :available-list-names="['list2']"
        >
          <template #listItem="{ listItem }">{{ listItem }}</template>
        </DraggableList>
        <DraggableList listName="list2" :items="[4, 5, 6]">
          <template #listItem="{ listItem }">{{ listItem }}</template>
        </DraggableList>
      </PopupComponent>
      <ButtonComponent text="Тест notify" @click="emitNotify" />
      <ButtonComponent text="Тест notify5" @click="emitNotify5" />
      <RouterView></RouterView>
    </template>
  </DefaultLayout>
</template>
<style>
.flex {
  display: flex;
  justify-content: space-between;
}
.width200px {
  max-width: 400px;
  margin: 5px 0;
}
.margin5 {
  margin: 5px 0;
}
.input-class {
  max-width: 550px;
  margin: 20px 0;
}
.arrow-class {
  background-image: url('./assets/images/arrow-button.svg');
}
.table .tnnc-table-wrapper {
}
</style>
