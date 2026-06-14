import React from 'react'
import TrafficLight from '../components/TrafficLight'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icons'
import { useI18n } from '../contexts/I18nContext'
import { projectService } from '../services/projectService'
import { shortPeso, signedPercent } from '../utils/formatters'
import type { Project, RiskClassification } from '../types'

const riskOrder: RiskClassification[] = ['Low', 'Medium', 'High']

function Metric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <Card className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{helper}</p>
    </Card>
  )
}

function ProjectCard({ project, active, onSelect }: { project: Project; active: boolean; onSelect: () => void }) {
  return (
    <button type="button" className={`project-card ${active ? 'active' : ''}`} onClick={onSelect}>
      <div className="project-card-header">
        <span>{project.contract_id}</span>
        <TrafficLight risk={project.risk_classification} compact />
      </div>
      <h3>{project.project_title}</h3>
      <p>{project.location}</p>
      <div className="project-card-meta">
        <span>{shortPeso(project.contract_amount)}</span>
        <span>{project.physical_target}</span>
        <span>{project.citizen_upload_count}</span>
      </div>
    </button>
  )
}

function ProjectDetail({ project, onUpload }: { project: Project; onUpload: () => void }) {
  const { t } = useI18n()
  const helperKey = project.risk_classification === 'High' ? 'risk.highHelper' : project.risk_classification === 'Medium' ? 'risk.mediumHelper' : 'risk.lowHelper'

  return (
    <Card className="project-detail">
      <div className="detail-header">
        <TrafficLight risk={project.risk_classification} />
        <span>{t(helperKey)}</span>
      </div>
      <h2>{project.project_title}</h2>
      <p>{project.implementing_office}</p>

      <dl className="metric-grid">
        <div><dt>{t('dashboard.contractAmount')}</dt><dd>{shortPeso(project.contract_amount)}</dd></div>
        <div><dt>{t('dashboard.costDeviation')}</dt><dd>{signedPercent(project.cost_deviation_percent)}</dd></div>
        <div><dt>{t('dashboard.scheduleSlippage')}</dt><dd>{signedPercent(project.slippage_percent)}</dd></div>
        <div><dt>{t('dashboard.lastUpdate')}</dt><dd>{project.last_updated}</dd></div>
      </dl>

      {project.anomaly_note && <div className="anomaly-banner"><Icon name="alert" />{project.anomaly_note}</div>}

      <p className="analysis-panel">{project.ai_engine_analysis}</p>

      <div className="watchlist">
        <h3>{t('dashboard.materialWatchlist')}</h3>
        {project.bill_of_quantities_materials.slice(0, 3).map((material) => (
          <div key={material.item_code}>
            <span>{material.description}</span>
            <strong>{signedPercent(material.item_deviation_percent)}</strong>
          </div>
        ))}
      </div>

      <Button onClick={onUpload}>{t('dashboard.verifyProject')}</Button>
    </Card>
  )
}

export default function Dashboard({ onUpload }: { onUpload: () => void }) {
  const { t } = useI18n()
  const projects = projectService.listProjects()
  const metrics = projectService.getMetrics()
  const [query, setQuery] = React.useState('')
  const [risk, setRisk] = React.useState<RiskClassification | 'All'>('All')
  const [selectedId, setSelectedId] = React.useState(projects[0]?.contract_id ?? '')

  const filtered = projects.filter((project) => {
    const searchableText = `${project.project_title} ${project.location} ${project.contract_id} ${project.contractor}`.toLowerCase()
    return searchableText.includes(query.toLowerCase()) && (risk === 'All' || project.risk_classification === risk)
  })

  const selectedProject = projectService.getProjectById(selectedId) ?? filtered[0] ?? projects[0]

  React.useEffect(() => {
    if (filtered.length > 0 && !filtered.some((project) => project.contract_id === selectedId)) {
      setSelectedId(filtered[0].contract_id)
    }
  }, [filtered, selectedId])

  return (
    <div className="workspace-page">
      <div className="workspace-hero">
        <p className="eyebrow">{t('common.staticData')}</p>
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.description')}</p>
      </div>

      <div className="metrics-row">
        <Metric label={t('dashboard.trackedProjects')} value={String(metrics.totalProjects)} helper={t('dashboard.loadedFrom')} />
        <Metric label={t('dashboard.contractValue')} value={shortPeso(metrics.totalBudget)} helper={t('dashboard.prototypeRecords')} />
        <Metric label={t('dashboard.citizenSignals')} value={String(metrics.citizenReports)} helper={`${metrics.highRiskProjects} ${t('dashboard.highRiskFlagged')}`} />
      </div>

      <div className="workspace-grid">
        <section className="workspace-list">
          <Card className="filter-card">
            <label htmlFor="project-search">{t('dashboard.searchLabel')}</label>
            <div className="search-control">
              <Icon name="search" />
              <input id="project-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('dashboard.searchPlaceholder')} />
            </div>
            <div className="filter-row">
              {(['All', ...riskOrder] as Array<RiskClassification | 'All'>).map((item) => (
                <button key={item} type="button" className={risk === item ? 'active' : ''} onClick={() => setRisk(item)}>
                  {item === 'All' ? t('common.all') : t(`risk.${item}`)}
                </button>
              ))}
            </div>
          </Card>

          {filtered.length === 0 ? (
            <Card className="empty-state">{t('common.empty')}</Card>
          ) : (
            filtered.map((project) => (
              <ProjectCard key={project.contract_id} project={project} active={selectedProject.contract_id === project.contract_id} onSelect={() => setSelectedId(project.contract_id)} />
            ))
          )}
        </section>

        <ProjectDetail project={selectedProject} onUpload={onUpload} />
      </div>
    </div>
  )
}
