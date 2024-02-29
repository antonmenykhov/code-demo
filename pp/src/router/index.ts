import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { reportRoutes } from './reports'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/tpr',
    name: 'ProdProg',
    component: () => import('../views/ProdProg.vue'),
    meta: { title: 'Тематический план работ' }
  },
  {
    path: '/handbooks',
    name: 'Handbooks',
    component: () => import('../views/HandbooksView.vue'),
    meta: { title: 'Справочники' }
  },
  {
    path: '/moderator',
    name: 'Moderator',
    component: () => import('../views/EMPModerator.vue'),
    meta: { title: 'Модератор срезов' }
  },
  {
    path: '/report',
    name: 'Reports',
    children: reportRoutes,
    meta: { title: 'Отчеты' }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../views/ProdProg.vue'),
    name: 'Страница не найдена',
    meta: { title: 'Тематический план работ' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((route) => {
  document.title = `${route.meta.title}` || 'ПУЭД'
})

export default router
