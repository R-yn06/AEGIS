import React from 'react'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icons'
import TrafficLight from '../components/TrafficLight'
import { useI18n } from '../contexts/I18nContext'
import { useProjects } from '../hooks/useProjects'
import { shortPeso } from '../utils/formatters'

const contractorFilters = ['All', 'Critical', 'High', 'Medium', 'Low'] as const
type ContractorFilter = (typeof contractorFilters)[number]

export default function SupplierDirectory() {
  const { t } = useI18n()
  const [filter, setFilter] = React.useState<ContractorFilter>('All')
  const [query, setQuery] = React.useState('')
  const projectsQuery = useProjects()
  const projects = projectsQuery.data?.projects ?? []

  const filtered = projects.filter((project) => {
    const text = `${project.contractor} ${project.projectTitle} ${project.contractId} ${project.region} ${project.category}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (filter === 'All' || project.riskClassification === filter)
  })

  const totalValue = projects.reduce((sum, project) => sum + project.budget, 0)
  const flaggedCount = projects.filter((project) => project.riskClassification === 'High' || project.riskClassification === 'Critical').length

  return (
    <div className="workspace-page">
      <div className="workspace-hero">
        <p className="eyebrow">{t('navigation.suppliers')}</p>
        <h1>Contractor Accountability</h1>
        <p>Review contractors, project value, and live AI risk classifications from the DPWH Watchdog API.</p>
      </div>

      <div className="metrics-row">
        <Card className="metric-card"><span>Contractors</span><strong>{new Set(projects.map((project) => project.contractor)).size}</strong></Card>
        <Card className="metric-card"><span>Tracked Value</span><strong>{shortPeso(totalValue)}</strong></Card>
        <Card className="metric-card"><span>Flagged Projects</span><strong>{flaggedCount}</strong></Card>
      </div>

      <Card className="filter-card sticky-filter">
        <label htmlFor="contractor-search">Search contractors and projects</label>
        <div className="search-control">
          <Icon name="search" />
          <input id="contractor-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by contractor, project, contract ID, or region" />
        </div>
        <div className="filter-row">
          {contractorFilters.map((item) => (
            <button key={item} type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
      </Card>

      <section className="material-grid">
        {projectsQuery.isLoading ? (
          <div className="skeleton-list"><span /><span /><span /></div>
        ) : filtered.length === 0 ? (
          <Card className="empty-state">{t('common.empty')}</Card>
        ) : (
          filtered.map((project) => (
            <Card key={project.contractId} interactive className="material-card">
              <div className="material-card-header">
                <div>
                  <p className="material-project">{project.contractId}</p>
                  <h3>{project.contractor}</h3>
                </div>
                <TrafficLight risk={project.riskClassification} compact />
              </div>
              <p>{project.projectTitle}</p>
              <div className="material-card-footer">
                <span>{project.region}</span>
                <strong>{shortPeso(project.budget)}</strong>
              </div>
            </Card>
          ))
        )}
      </section>
    </div>
  )
}
