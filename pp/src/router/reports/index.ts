import type { RouteRecordRaw } from 'vue-router'
import { suppReportRoutes } from './supp'

const reportRoutes: Array<RouteRecordRaw> = [
  {
    path: 'supp',
    name: 'SuppReports',
    children: suppReportRoutes,
    meta: { title: 'СУПП' }
  }
]

export { reportRoutes }
