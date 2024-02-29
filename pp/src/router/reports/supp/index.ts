import type { RouteRecordRaw } from 'vue-router'

const suppReportRoutes: Array<RouteRecordRaw> = [
  {
    path: 'production',
    name: 'SuppReportProduction',
    component: () => import('@/views/reports/supp/SuppProductionReport.vue'),
    meta: { title: 'Отчет производство' }
  },
  {
    path: 'kind-work',
    name: 'SuppKindworkReport',
    component: () => import('@/views/reports/supp/SuppKindworkReport.vue'),
    meta: { title: 'Свод по ВД' }
  },
  {
    path: 'economic',
    name: 'SuppReportEconomic',
    component: () => import('@/views/reports/supp/SuppReportEconomic.vue'),
    meta: { title: 'Отчет экономика', reportType: 'common' }
  },
  {
    path: 'economic-tp',
    name: 'SuppReportEconomicTp',
    component: () => import('@/views/reports/supp/SuppReportEconomic.vue'),
    meta: { title: 'Отчет экономика ТП', reportType: 'tp' }
  },
  {
    path: 'economic-capex',
    name: 'SuppReportEconomicCapex',
    component: () => import('@/views/reports/supp/SuppReportEconomic.vue'),
    meta: { title: 'Отчет экономика CAPEX-OPEX', reportType: 'capex' }
  },
  {
    path: 'summary',
    name: 'SuppSummaryReport',
    component: () => import('@/views/reports/supp/SuppSummaryReport.vue'),
    meta: { title: 'Свод по подразделениям' }
  },
  {
    path: 'error',
    name: 'ErrorReport',
    component: () => import('@/views/reports/supp/ErrorReport.vue'),
    meta: { title: 'Отчет об ошибках' }
  },
  {
    path: 'mnemonic',
    name: 'Mnemonic',
    component: () => import('@/views/reports/supp/SuppMnemomicReport.vue'),
    meta: { title: 'Отчет по мнемонике' }
  }
]

export { suppReportRoutes }
