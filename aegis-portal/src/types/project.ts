export type RiskClassification = 'Low' | 'Medium' | 'High' | 'Critical'

export type ProjectFilters = {
  risk?: RiskClassification
  region?: string
  category?: string
  search?: string
}

export type CitizenReport = {
  id: string
  contractId: string
  reporterName: string
  text: string
  photoKey?: string
  photoUrl?: string
  verificationStatus: string
  createdAt: string
}

export type Project = {
  contractId: string
  projectTitle: string
  programName?: string
  contractor: string
  region: string
  province: string
  municipality?: string
  category: string
  status: string
  budget: number
  amountPaid: number
  progress: number
  riskClassification: RiskClassification
  riskScore: number
  citizenReportCount: number
  riskFlags: string[]
  riskTrend: 'up' | 'down' | 'stable'
  aiNarrative: string
  sourceOfFunds?: string
  infraYear?: string
  startDate?: string
  completionDate?: string
  lastUpdated?: string
  latitude?: number
  longitude?: number
  isLive?: boolean
  citizenReports?: CitizenReport[]
}

export type ProjectsResponse = {
  projects: Project[]
  count: number
  nextKey?: string | null
}

export type UploadUrlResponse = {
  uploadUrl: string
  photoKey: string
  publicUrl?: string
  expiresIn?: number
}

export type SubmitReportInput = {
  text: string
  reporterName: string
  photoKey?: string
}
