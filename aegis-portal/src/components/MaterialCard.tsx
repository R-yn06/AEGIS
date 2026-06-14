import { useI18n } from '../contexts/I18nContext'
import { projectService } from '../services/projectService'
import { peso, signedPercent } from '../utils/formatters'
import type { Material } from '../types'

type MaterialCardProps = {
  material: Material & {
    project_title: string
    location: string
  }
}

export default function MaterialCard({ material }: MaterialCardProps) {
  const { t } = useI18n()
  const status = Math.abs(material.item_deviation_percent) >= 25 ? 'High' : Math.abs(material.item_deviation_percent) >= 10 ? 'Medium' : 'Low'
  const tone = projectService.getRiskTone(status)

  return (
    <article className="material-card">
      <div className="material-card-header">
        <div>
          <p>{material.item_code}</p>
          <h3>{material.description}</h3>
        </div>
        <span className={`variance-badge variance-${tone}`}>{signedPercent(material.item_deviation_percent)}</span>
      </div>

      <dl className="metric-grid compact">
        <div>
          <dt>{t('suppliers.declared')}</dt>
          <dd>{peso(material.unit_cost_declared)}</dd>
        </div>
        <div>
          <dt>{t('suppliers.baseline')}</dt>
          <dd>{peso(material.baseline_unit_cost)}</dd>
        </div>
      </dl>

      <div className="material-card-footer">
        <span>{t('suppliers.quantity')}: {material.quantity.toLocaleString()} {material.unit}</span>
        <span>{material.location}</span>
      </div>
      <p className="material-project">{material.project_title}</p>
    </article>
  )
}
