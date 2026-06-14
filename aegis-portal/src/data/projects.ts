import projects from '../../projects.json'
import type { Project } from '../types'

export const projectData = projects as Project[]

export const riskCopy = {
  Low: {
    label: 'Good',
    helper: 'Within normal range',
  },
  Medium: {
    label: 'Review',
    helper: 'Needs community check',
  },
  High: {
    label: 'High Risk',
    helper: 'Priority validation',
  },
} as const

export function peso(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function shortPeso(value: number) {
  if (value >= 1_000_000_000) return `PHP ${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `PHP ${(value / 1_000_000).toFixed(1)}M`
  return peso(value)
}

export function riskTone(risk: Project['risk_classification']) {
  if (risk === 'High') {
    return {
      dot: 'bg-red-500',
      text: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
    }
  }

  if (risk === 'Medium') {
    return {
      dot: 'bg-yellow-400',
      text: 'text-yellow-800',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
    }
  }

  return {
    dot: 'bg-green-500',
    text: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
  }
}
