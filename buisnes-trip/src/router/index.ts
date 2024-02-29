import { loadingState } from '@/store/loading.state'
import { titleStore } from '@/store/title.store'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  //{
  //  path: '/',
  //  name: 'home',
  //  component: () => import('../views/HomeView.vue')
  //},
  {
    path: '/handbook',
    name: 'Handbook',
    component: () => import('../views/handbooks/HandbookView.vue'),
    meta: {
      requiredRoles: ['isAdmin', 'isEconomist'],
      name: 'Справочники'
    }
  },
  {
    path: '/trip-card/:id',
    name: 'InputForm',
    component: () => import('../views/tripCard/TripCardView.vue'),
    meta: {
      name: 'Карточка командировки'
    }
  },
  {
    path: '/limit-card/:id',
    name: 'LimitForm',
    component: () => import('../views/limitCard/LimitCard.vue'),
    meta: {
      name: 'Карточка лимита'
    }
  },
  {
    path: '/',
    name: 'TripList',
    component: () => import('../views/TripList.vue'),
    meta: {
      name: 'Список командировок'
    }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/mainReport/ReportView.vue'),
    meta: {
      name: 'Главный отчет'
    }
  },
  {
    path: '/report-daily-payment',
    name: 'ReportDaily',
    component: () => import('../views/DailyPaymentReport.vue'),
    meta: {
      name: 'Отчет по суточным'
    }
  },
  {
    path: '/managment/',
    name: 'Managment',
    children: [
      {
        path: 'users',
        name: 'UserManagment',
        component: () => import('../views/managment/UserManagment.vue'),
        meta: {
          requiredRoles: ['isAdmin', 'isEconomist'],
          name: 'Управление пользователями'
        }
      },
      {
        path: 'roles',
        name: 'RolesManagment',
        component: () => import('../views/managment/RoleManagment.vue'),
        meta: {
          requiredRoles: ['isAdmin', 'isEconomist'],
          name: 'Управление ролями'
        }
      },
      {
        path: 'user-access',
        name: 'UserAccess',
        component: () => import('../views/managment/UserFinStructureManagment.vue'),
        meta: {
          requiredRoles: ['isAdmin', 'isEconomist'],
          name: 'Управление доступом'
        }
      },
      {
        path: 'statuses',
        name: 'UserStatuses',
        component: () => import('../views/managment/UserStatuses.vue'),
        meta: {
          requiredRoles: ['isAdmin', 'isEconomist'],
          name: 'Статусы пользователей'
        }
      }
    ]
  },
  {
    path: '/fact/upload',
    name: 'UploadPage',
    component: () => import('../views/fact-data/UploadPage.vue'),
    meta: {
      name: 'Загрузка данных'
    }
  },
  {
    path: '/fact/handbook',
    name: 'FactHandbook',
    component: () => import('../views/fact-data/FactHandbook.vue'),
    meta: {
      name: 'Загруженный факт'
    }
  },
  {
    path: '/fact/handbook-pre',
    name: 'PreFactHandbook',
    component: () => import('../views/fact-data/PreFactHandbook.vue'),
    meta: {
      name: 'Обработанный факт'
    }
  },
  {
    path: '/generic/:id+',
    name: 'Generic',
    component: () => import('../views/GenericTable.vue'),
    meta: {
      name: 'Свободный отчет'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(() => {
  const loading = loadingState()
  loading.routerLoading = true
  // if (next.meta.requiredRoles) {
  //   const roles = roleStore()
  //   if (!(next.meta.requiredRoles as string[]).some((item) => roles[item as keyof typeof roles]))
  //     return { path: '/' }
  // }
})
router.afterEach((to) => {
  const { setTitle } = titleStore()
  setTitle(to.meta.name as string | undefined)
  const loading = loadingState()
  loading.routerLoading = false
})

export default router
