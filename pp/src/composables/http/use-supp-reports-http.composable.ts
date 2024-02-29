import { supp_url } from '@/config/urls'
import useHttp from './use-http.composable'
import type { SuppProductionReport } from '@/interfaces/supp-entities/reports/production.interface'
import type { SuppMnemonicReport } from '@/interfaces/supp-entities/reports/mnemonic.interface'
import type { SuppKindworkReport } from '@/interfaces/supp-entities/reports/kindwork.interface'
import type { SuppEconomicReportType } from '@/views/reports/supp/SuppReportEconomic.vue'
import type {
  SuppEconomicCapexReport,
  SuppEconomicReport
} from '@/interfaces/supp-entities/reports/economic.interface'
import type { SuppSummaryReport } from '@/interfaces/supp-entities/reports/summary.interface'
import type { DepartmentAmount } from '@/interfaces/supp-entities/reports/department-amount.interface'

export default function useSuppReportsHttp() {
  const { http } = useHttp()

  async function getReportProduction(year: number) {
    return http.get<SuppProductionReport[]>(`${supp_url}/report/production/year=${year}`)
  }

  async function getReportMnemonic(year: number) {
    return http.get<SuppMnemonicReport[]>(`${supp_url}/report/mnemonics/year=${year}`)
  }

  async function getReportKindWork(year: number, month: number) {
    return http.get<SuppKindworkReport[]>(
      `${supp_url}/report/activities/year=${year}&month=${month}`
    )
  }

  async function getReportEconomic(year: number, reportType: SuppEconomicReportType) {
    let url = `${supp_url}/report/economic/year=${year}`
    if (reportType === 'tp') url += '&options=prognos'
    if (reportType === 'capex') url += '&options=capex'
    return http.get<SuppEconomicCapexReport[] | SuppEconomicReport[]>(url)
  }

  async function getReportSummary(year: number, range: number[]) {
    return http.get<SuppSummaryReport[]>(
      `${supp_url}/report/subdivision/year=${year}&mounth=${range[0]}_${range[1]}`
    )
  }
  async function getDepartmentAmount() {
    return http.get<DepartmentAmount[]>(`${supp_url}/DepartmentAmount`)
  }
  async function createDepartmentAmount(payload: Omit<DepartmentAmount, 'id'>) {
    return http.post(`${supp_url}/DepartmentAmount`, payload)
  }
  async function updateDepartmentAmount(payload: DepartmentAmount) {
    return http.put(`${supp_url}/DepartmentAmount`, payload)
  }

  return {
    getReportProduction,
    getReportMnemonic,
    getReportKindWork,
    getReportEconomic,
    getReportSummary,
    getDepartmentAmount,
    createDepartmentAmount,
    updateDepartmentAmount
  }
}
