import { useRoleStore } from '@/store'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/survey',
    name: 'survey',
    component: () => import('../views/UserSurvey.vue'),
    meta: {
      roles: ['RESPONDENT']
    }
  },
  {
    path: '/managment/users',
    component: () => import('../views/managment/UserManagment.vue'),
    meta: {
      roles: ['ADMINISTRATOR']
    }
  },
  {
    path: '/managment/blocks',
    component: () => import('../views/managment/BlockManagment.vue'),
    meta: {
      roles: ['ADMINISTRATOR']
    }
  },
  {
    path: '/managment/periods',
    component: () => import('../views/managment/PeriodManagment.vue'),
    meta: {
      roles: ['ADMINISTRATOR']
    }
  },
  {
    path: '/my-answers',
    component: () => import('../views/reports/MyAnswers.vue'),
    meta: {
      roles: ['RESPONDENT']
    }
  },
  {
    path: '/my-actions',
    component: () => import('../views/reports/MyAnswerActions.vue'),
    meta: {
      roles: ['RESPONDENT']
    }
  },
  {
    path: '/department-answers',
    component: () => import('../views/reports/DepartmentAnswers.vue'),
    meta: {
      roles: ['RESPONSIBLE']
    }
  },
  {
    path: '/department-actions',
    component: () => import('../views/reports/DepartmentActions.vue'),
    meta: {
      roles: ['RESPONSIBLE']
    }
  },
  {
    path: '/all-answers',
    component: () => import('../views/reports/AllAnswers.vue'),
    meta: {
      roles: ['ADMINISTRATOR', 'MANAGER']
    }
  },
  {
    path: '/all-actions',
    component: () => import('../views/reports/AllActions.vue'),
    meta: {
      roles: ['ADMINISTRATOR', 'MANAGER']
    }
  },
  {
    path: '/actions',
    component: () => import('../views/ActionManaging.vue'),
    meta: {
      roles: ['ADMINISTRATOR', 'MANAGER', 'RESPONSIBLE']
    }
  },
  {
    path: '/viewer-answers',
    component: () => import('../views/reports/ViewerAnswers.vue'),
    meta: {
      roles: ['VIEWER']
    }
  },
  {
    path: '/viewer-actions',
    component: () => import('../views/reports/ViewerActions.vue'),
    meta: {
      roles: ['VIEWER']
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const roleStore = useRoleStore()
  if (
    to.meta.roles &&
    !roleStore.roles.some((role) => (to.meta.roles as string[]).includes(role))
  ) {
    return { path: '/' }
  }
})

export default router
