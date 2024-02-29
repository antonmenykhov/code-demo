import { useDocumentTitleStore } from '@/stores/documentTitleStore'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/documents/in'
    },
    {
      path: '/contractors',
      name: 'Contractors',
      component: () => import('@/views/ContractorsView.vue'),
      meta: {
        title: 'Контрагенты'
      }
    },
    {
      path: '/companies',
      name: 'Companies',
      component: () => import('@/views/CompaniesView.vue'),
      meta: {
        title: 'Компании'
      }
    },
    {
      path: '/staff',
      name: 'Staff',
      component: () => import('@/views/StaffView.vue'),
      meta: {
        title: 'Сотрудники'
      }
    },
    {
      path: '/delegations',
      name: 'Delegations',
      component: () => import('@/views/DelegationView.vue'),
      meta: {
        title: 'Поручения'
      }
    },
    {
      path: '/emails',
      name: 'Emails',
      component: () => import('@/views/EmailsView.vue'),
      meta: {
        title: 'Поручения'
      }
    },
    {
      path: '/documents/:direction',
      name: 'Documents',
      component: () => import('@/views/DocumentsView.vue')
    }
  ]
})

router.beforeEach((to) => {
  const { currentPageName } = storeToRefs(useDocumentTitleStore())
  if (to.params.direction) {
    currentPageName.value = to.params.direction === 'in' ? 'Входящие' : 'Исходящие'
  } else {
    currentPageName.value = String(to.meta?.title || 'Документы')
  }
})
export default router
