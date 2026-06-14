import type { RiskClassification } from '../types'
import { projectService } from '../services/projectService'
import { useI18n } from '../contexts/I18nContext'

type TrafficLightProps = {
  risk: RiskClassification
  compact?: boolean
}

export default function TrafficLight({ risk, compact = false }: TrafficLightProps) {
  const { t } = useI18n()
  const tone = projectService.getRiskTone(risk)
  const helperKey = risk === 'High' ? 'risk.highHelper' : risk === 'Medium' ? 'risk.mediumHelper' : 'risk.lowHelper'

  return (
    <span className={`risk-pill risk-${tone}`} aria-label={`${t(`risk.${risk}`)}: ${t(helperKey)}`}>
      <span />
      {compact ? t(`risk.${risk}`) : `${t(`risk.${risk}`)}`}
    </span>
  )
}
