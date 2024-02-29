import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import './assets/main.css';
import ButtonComponent from './components/ButtonComponent.vue';
import LabelComponent from './components/LabelComponent.vue';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: () => ButtonComponent,
    },
    {
      name: 'survey',
      path: '/survey',
      component: () => LabelComponent,
    },
  ],
});
createApp(App).use(router).mount('#app');
