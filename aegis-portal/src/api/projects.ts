import { apiRequest } from './client'
import { getRiskScoreFallback, getRiskTrend, normalizeRisk } from '../utils/risk'
import type { CitizenReport, Project, ProjectFilters, ProjectsResponse, SubmitReportInput } from '../types/project'

type RawRecord = Record<string, any>

function numberFrom(value: unknown, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function stringFrom(value: unknown, fallback = 'Not specified') {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export function normalizeReport(raw: RawRecord, contractId = ''): CitizenReport {
  const photoUrl = raw.photoUrl ?? raw.publicUrl ?? raw.imageUrl ?? raw.image_url
  return {
    id: stringFrom(raw.reportId ?? raw.id ?? raw.createdAt ?? raw.created_at ?? crypto.randomUUID(), crypto.randomUUID()),
    contractId: stringFrom(raw.contractId ?? raw.contract_id ?? contractId, contractId),
    reporterName: stringFrom(raw.reporterName ?? raw.reporter_name ?? raw.name, 'Concerned citizen'),
    text: stringFrom(raw.text ?? raw.reportText ?? raw.report_text ?? raw.description, ''),
    photoKey: raw.photoKey ?? raw.photo_key,
    photoUrl,
    verificationStatus: stringFrom(raw.verificationStatus ?? raw.verification_status ?? raw.status, 'Pending review'),
    createdAt: stringFrom(raw.createdAt ?? raw.created_at ?? raw.reportDate ?? raw.report_date, new Date().toISOString()),
  }
}

export function normalizeProject(raw: RawRecord): Project {
  const riskClassification = normalizeRisk(raw.riskClassification ?? raw.risk_classification)
  const riskScore = numberFrom(raw.riskScore ?? raw.risk_score, getRiskScoreFallback(riskClassification))
  const reports = Array.isArray(raw.citizenReports) ? raw.citizenReports.map((report) => normalizeReport(report, raw.contractId ?? raw.contract_id)) : undefined

  return {
    contractId: stringFrom(raw.contractId ?? raw.contract_id, ''),
    projectTitle: stringFrom(raw.projectTitle ?? raw.project_title, 'Untitled infrastructure project'),
    programName: raw.programName ?? raw.program_name,
    contractor: stringFrom(raw.contractor, 'Contractor not disclosed'),
    region: stringFrom(raw.region ?? raw.geospatial?.region, 'Unspecified region'),
    province: stringFrom(raw.province ?? raw.geospatial?.province, 'Unspecified province'),
    municipality: raw.municipality ?? raw.city,
    category: stringFrom(raw.category ?? raw.category_of_work, 'Uncategorized'),
    status: stringFrom(raw.status, 'Status unavailable'),
    budget: numberFrom(raw.budget ?? raw.contract_amount ?? raw.approved_budget_contract),
    amountPaid: numberFrom(raw.amountPaid ?? raw.amount_paid),
    progress: numberFrom(raw.progress ?? raw.completionPercent ?? raw.completion_percent ?? raw.physical_target),
    riskClassification,
    riskScore,
    citizenReportCount: numberFrom(raw.citizenReportCount ?? raw.citizen_report_count ?? raw.citizen_upload_count, reports?.length ?? 0),
    riskFlags: Array.isArray(raw.riskFlags) ? raw.riskFlags : Array.isArray(raw.risk_flags) ? raw.risk_flags : [],
    riskTrend: getRiskTrend(riskScore),
    aiNarrative: stringFrom(raw.aiNarrative ?? raw.ai_engine_analysis, 'AI analysis is not yet available for this project.'),
    sourceOfFunds: raw.sourceOfFunds ?? raw.source_of_funds,
    infraYear: raw.infraYear ?? raw.infra_year,
    startDate: raw.startDate ?? raw.start_date,
    completionDate: raw.completionDate ?? raw.completion_date,
    lastUpdated: raw.lastUpdated ?? raw.last_updated,
    latitude: raw.latitude ?? raw.geospatial?.latitude,
    longitude: raw.longitude ?? raw.geospatial?.longitude,
    isLive: Boolean(raw.isLive ?? raw.is_live),
    citizenReports: reports,
  }
}

export async function getProjects(filters: ProjectFilters = {}): Promise<ProjectsResponse> {
  const payload = await apiRequest<RawRecord | RawRecord[]>('/projects', { query: filters })
  const rawProjects = Array.isArray(payload) ? payload : Array.isArray(payload.projects) ? payload.projects : []
  return {
    projects: rawProjects.map(normalizeProject).filter((project) => project.contractId),
    count: numberFrom(Array.isArray(payload) ? rawProjects.length : payload.count, rawProjects.length),
    nextKey: Array.isArray(payload) ? null : payload.nextKey ?? null,
  }
}

export async function getProject(contractId: string): Promise<Project> {
  const payload = await apiRequest<RawRecord>(`/projects/${encodeURIComponent(contractId)}`)
  return normalizeProject(payload)
}

export async function getReports(contractId: string): Promise<CitizenReport[]> {
  const payload = await apiRequest<RawRecord | RawRecord[]>(`/projects/${encodeURIComponent(contractId)}/reports`)
  const reports = Array.isArray(payload) ? payload : Array.isArray(payload.reports) ? payload.reports : []
  return reports.map((report) => normalizeReport(report, contractId)).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export async function submitReport(contractId: string, input: SubmitReportInput): Promise<CitizenReport> {
  const payload = await apiRequest<RawRecord>(`/projects/${encodeURIComponent(contractId)}/reports`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return normalizeReport(payload.report ?? payload, contractId)
}

export async function recalculateScore(contractId: string): Promise<Project | undefined> {
  const payload = await apiRequest<RawRecord | undefined>(`/projects/${encodeURIComponent(contractId)}/score`, {
    method: 'POST',
  })
  return payload ? normalizeProject(payload) : undefined
}
