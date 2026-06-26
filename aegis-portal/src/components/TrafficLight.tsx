import type { RiskClassification } from '../types'
import { getRiskTone } from '../utils/risk'
import { useI18n } from '../contexts/I18nContext'

type TrafficLightProps = {
  risk: RiskClassification
  compact?: boolean
}

export default function TrafficLight({ risk, compact = false }: TrafficLightProps) {
  const { t } = useI18n()
  const tone = getRiskTone(risk)

  // map risk -> translation keys (add 'risk.Critical' if you want a specific translation)
  const labelKeyMap: Record<RiskClassification, string> = {
    Critical: 'risk.Critical',
    High: 'risk.High',
    Medium: 'risk.Medium',
    Low: 'risk.Low',
  }

  const helperKeyMap: Record<RiskClassification, string> = {
    Critical: 'risk.criticalHelper', // optional: create this key in translations
    High: 'risk.highHelper',
    Medium: 'risk.mediumHelper',
    Low: 'risk.lowHelper',
  }

  const labelKey = labelKeyMap[risk] ?? `risk.${String(risk)}`
  let label = t(labelKey)
  // if translation missing, fallback to the raw risk string (e.g. "Critical")
  if (label === labelKey || /^risk\./.test(label)) label = String(risk)

  const helperKey = helperKeyMap[risk] ?? 'risk.lowHelper'
  let helper = t(helperKey)
  // if helper translation missing, fall back to high/medium/low helpers or empty
  if (helper === helperKey || /^risk\./.test(helper)) {
    helper = risk === 'Critical' ? (t('risk.highHelper') === 'risk.highHelper' ? '' : t('risk.highHelper')) : ''
  }

  return (
    <span className={`risk-pill risk-${tone}`} aria-label={`${label}${helper ? `: ${helper}` : ''}`}>
      <span />
      {compact ? label : `${label}`}
    </span>
  )
}
