import { useLoadingState } from '@/store/loading.state'
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: '/handbooks'
  },
  {
    path: '/handbooks',
    name: 'Handbooks',
    component: () => import('@/views/HandbooksView.vue')
  },
  {
    path: '/forms',
    name: 'FormManagmentView',
    component: () => import('@/views/FormManagmentView.vue')
  },
  {
    path: '/form/:id',
    name: 'FormCardView',
    component: () => import('@/views/FormCardView.vue')
  },
  {
    path: '/request-stages',
    name: 'RequestStagesManagment',
    component: () => import('@/views/RequestStagesManagment.vue')
  },
  {
    path: '/request-card/:id',
    name: 'RequestCard',
    component: () => import('@/views/RequestCard.vue')
  },
  {
    path: '/my-requests',
    name: 'MyRequestsView',
    component: () => import('@/views/MyRequestsView.vue')
  },
  {
    path: '/requests',
    name: 'AllRequestsView',
    component: () => import('@/views/AllRequestsView.vue')
  },
  {
    path: '/report',
    name: 'ReportView',
    component: () => import('@/views/ReportView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(() => {
  const loading = useLoadingState()
  loading.routerLoading = true
})
router.afterEach(() => {
  const loading = useLoadingState()
  loading.routerLoading = false
})

export default router
