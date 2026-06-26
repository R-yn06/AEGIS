import type { RiskClassification } from '../types/project'

export function normalizeRisk(value: unknown): RiskClassification {
  if (value === 'Critical') return 'Critical'
  if (value === 'High') return 'High'
  if (value === 'Medium') return 'Medium'
  return 'Low'
}

export function getRiskTone(risk: RiskClassification) {
  if (risk === 'Critical') return 'critical'
  if (risk === 'High') return 'danger'
  if (risk === 'Medium') return 'warning'
  return 'success'
}

export function getRiskScoreFallback(risk: RiskClassification) {
  if (risk === 'Critical') return 92
  if (risk === 'High') return 72
  if (risk === 'Medium') return 48
  return 22
}

export function getRiskTrend(score: number): 'up' | 'down' | 'stable' {
  if (score >= 75) return 'up'
  if (score <= 30) return 'down'
  return 'stable'
}
