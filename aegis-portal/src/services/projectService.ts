import projects from '../../projects.json'
import type { Project, RiskClassification } from '../types'

export const projectService = {
  listProjects(): Project[] {
    return projects as Project[]
  },

  getProjectById(contractId: string): Project | undefined {
    return this.listProjects().find((project) => project.contract_id === contractId)
  },

  getMetrics() {
    const projectList = this.listProjects()
    return {
      totalProjects: projectList.length,
      totalBudget: projectList.reduce((sum, project) => sum + project.contract_amount, 0),
      citizenReports: projectList.reduce((sum, project) => sum + project.citizen_upload_count, 0),
      highRiskProjects: projectList.filter((project) => project.risk_classification === 'High').length,
      riskAlerts: projectList.filter((project) => project.risk_classification !== 'Low').length,
      verifiedEntries: projectList.reduce((sum, project) => sum + project.bill_of_quantities_materials.length, 0),
    }
  },

  getRiskTone(risk: RiskClassification) {
    if (risk === 'High') return 'danger'
    if (risk === 'Medium') return 'warning'
    return 'success'
  },
}
