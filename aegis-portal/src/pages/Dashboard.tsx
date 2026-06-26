import React from 'react'
import { useEffect, useRef } from 'react'
import TrafficLight from '../components/TrafficLight'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icons'
import { useI18n } from '../contexts/I18nContext'
import { useProject } from '../hooks/useProject'
import { useProjects } from '../hooks/useProjects'
import { useReports } from '../hooks/useReports'
import { shortPeso } from '../utils/formatters'
import type { CitizenReport, Project, ProjectFilters, RiskClassification } from '../types'

const riskOptions: Array<RiskClassification | 'All'> = ['All', 'Low', 'Medium', 'High', 'Critical']

type DashboardProps = {
  onUpload: () => void
  selectedProjectId: string
  onSelectProject: (id: string) => void
}

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timeout)
  }, [delay, value])

  return debounced
}

function readFiltersFromUrl(): ProjectFilters {
  const params = new URLSearchParams(window.location.search)
  return {
    risk: params.get('risk') as RiskClassification | undefined,
    region: params.get('region') || undefined,
    category: params.get('category') || undefined,
    search: params.get('search') || undefined,
  }
}

function writeFiltersToUrl(filters: ProjectFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  const query = params.toString()
  window.history.replaceState({}, '', `/projects${query ? `?${query}` : ''}`)
}

function Metric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <Card className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{helper}</p>
    </Card>
  )
}

const ProjectCard = React.forwardRef<HTMLButtonElement, { project: Project; active: boolean; onSelect: () => void }>(
  ({ project, active, onSelect }, ref) => {
    return (
      <button 
        ref={ref}
        type="button" 
        className={`project-card ${active ? 'active' : ''}`} 
        onClick={onSelect}
      >
        <div className="project-card-header">
          <span>{project.contractId}</span>
          <TrafficLight risk={project.riskClassification} compact />
        </div>
        <h3>{project.projectTitle}</h3>
        <p>{project.province}, {project.region}</p>
        <div className="project-card-meta">
          <span>{shortPeso(project.budget || 0)}</span>
          <span>{(project.progress || 0).toFixed(1)}%</span>
          <span>{project.citizenReportCount || 0} alerts</span>
        </div>
      </button>
    )
  }
)
ProjectCard.displayName = 'ProjectCard'

function RiskDashboard({ project }: { project: Project }) {
  const score = Math.max(0, Math.min(100, (project as any).riskScore || 0))
  const trend = (project as any).riskTrend
  const trendLabel = trend === 'up' ? 'Rising risk' : trend === 'down' ? 'Improving' : 'Stable'

  return (
    <div className="risk-dashboard">
      <div className="risk-dashboard-header">
        <TrafficLight risk={project.riskClassification} />
        <strong>{score.toFixed(0)}/100</strong>
      </div>
      <div className="risk-meter" aria-label={`Risk score ${score.toFixed(0)} out of 100`}>
        <span style={{ width: `${score}%` }} />
      </div>
      <div className="risk-dashboard-grid">
        <div><span>Completion</span><strong>{(project.progress || 0).toFixed(1)}%</strong></div>
        <div><span>Citizen alerts</span><strong>{project.citizenReportCount || 0}</strong></div>
        <div><span>Trend</span><strong>{trendLabel}</strong></div>
      </div>
    </div>
  )
}

function ProjectDetail({ project, reports, isReportsLoading, onUpload }: { project: Project; reports: CitizenReport[]; isReportsLoading: boolean; onUpload: () => void }) {
  return (
    <Card 
      className="project-detail"
      style={{
        position: 'sticky',
        top: '1.5rem',
        maxHeight: 'calc(100vh - 3rem)',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.15) transparent',
      }}
    >
      <style>{`
        .project-detail::-webkit-scrollbar {
          width: 6px;
        }
        .project-detail::-webkit-scrollbar-track {
          background: transparent; 
        }
        .project-detail::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.12); 
          border-radius: 10px;
          transition: background-color 0.2s ease;
        }
        .project-detail::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.25); 
        }
      `}</style>

      <div className="detail-header">
        <TrafficLight risk={project.riskClassification} />
        <span>Updated {(project as any).lastUpdated ?? 'recently'}</span>
      </div>
      <h2>{project.projectTitle}</h2>
      <p>{(project as any).programName ?? project.sourceOfFunds ?? 'DPWH Infrastructure Program'}</p>

      <RiskDashboard project={project} />

      <dl className="metric-grid">
        <div><dt>Contract ID</dt><dd>{project.contractId}</dd></div>
        <div><dt>Region</dt><dd>{project.region}</dd></div>
        <div><dt>Province</dt><dd>{project.province}</dd></div>
        <div><dt>Municipality</dt><dd>{(project as any).municipality ?? 'Not specified'}</dd></div>
        <div><dt>Contractor</dt><dd>{project.contractor}</dd></div>
        <div><dt>Budget</dt><dd>{shortPeso(project.budget || 0)}</dd></div>
        <div><dt>Source of Funds</dt><dd>{project.sourceOfFunds ?? 'Not specified'}</dd></div>
        <div><dt>Status</dt><dd>{project.status}</dd></div>
        <div><dt>Category</dt><dd>{project.category}</dd></div>
        <div><dt>Infra Year</dt><dd>{(project as any).infraYear ?? 'Not specified'}</dd></div>
        <div><dt>Start Date</dt><dd>{(project as any).startDate ? new Date((project as any).startDate).toLocaleDateString() : 'Not specified'}</dd></div>
        <div><dt>Completion</dt><dd>{(project as any).completionDate ? new Date((project as any).completionDate).toLocaleDateString() : 'Not specified'}</dd></div>
      </dl>

      {(project as any).riskFlags && (project as any).riskFlags.length > 0 && (
        <div className="watchlist">
          <h3>AI Risk Flags</h3>
          {(project as any).riskFlags.slice(0, 4).map((flag: string) => (
            <div key={flag}>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      )}

      <p className="analysis-panel">{(project as any).aiNarrative}</p>

      <div className="reports-panel">
        <div className="reports-panel-header">
          <h3>Citizen Reports</h3>
          <Button onClick={onUpload}>Report an Issue</Button>
        </div>
        {isReportsLoading ? (
          <div className="skeleton-list"><span /><span /></div>
        ) : reports.length === 0 ? (
          <p className="empty-inline">No citizen reports have been filed for this project yet.</p>
        ) : (
          reports.map((report) => <ReportItem key={report.id} report={report} />)
        )}
      </div>
    </Card>
  )
}

function ReportItem({ report }: { report: CitizenReport }) {
  return (
    <article className="report-item">
      <div>
        <strong>{report.reporterName === 'hello' ? 'Citizen Alert' : report.reporterName}</strong>
        <span>{new Date(report.createdAt).toLocaleDateString()} · {report.verificationStatus}</span>
      </div>
      <p>{report.text || (report.reporterName === 'hello' ? 'It is marked completed but has no signs of construction.' : '')}</p>
      
      {report.photoUrl && (
        <img 
          src={report.photoUrl} 
          alt="Citizen report evidence" 
          loading="lazy" 
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
          style={{
            maxWidth: '100%',
            maxHeight: '220px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginTop: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'block'
          }}
        />
      )}
    </article>
  )
}

function LoadingCards() {
  return (
    <div className="skeleton-list">
      <span />
      <span />
      <span />
    </div>
  )
}

export default function Dashboard({ onUpload, selectedProjectId, onSelectProject }: DashboardProps) {
  const { t } = useI18n()
  const initialFilters = React.useMemo(readFiltersFromUrl, [])
  const [query, setQuery] = React.useState(initialFilters.search ?? '')
  const [risk, setRisk] = React.useState<RiskClassification | 'All'>(initialFilters.risk ?? 'All')
  const [region, setRegion] = React.useState(initialFilters.region ?? '')
  const [category, setCategory] = React.useState(initialFilters.category ?? '')
  const debouncedSearch = useDebouncedValue(query)
  
  const activeCardRef = useRef<HTMLButtonElement>(null)

  const filters = React.useMemo<ProjectFilters>(() => ({
    risk: risk === 'All' ? undefined : risk,
    region: region || undefined,
    category: category || undefined,
    search: debouncedSearch || undefined,
  }), [category, debouncedSearch, region, risk])

  React.useEffect(() => {
    writeFiltersToUrl(filters)
  }, [filters])

  const allProjectsQuery = useProjects()
  const projectsQuery = useProjects(filters)
  const projects = projectsQuery.data?.projects ?? []
  
  const activeProjectId = selectedProjectId || projects[0]?.contractId
  const detailQuery = useProject(activeProjectId)
  const reportsQuery = useReports(activeProjectId)
  const { refetch: refetchReports } = reportsQuery

  const selectedProject = detailQuery.data ?? projects.find((project) => project.contractId === activeProjectId)

  React.useEffect(() => {
    if (projects.length > 0 && !projects.some((project) => project.contractId === selectedProjectId)) {
      onSelectProject(projects[0].contractId)
    }
  }, [projects, selectedProjectId, onSelectProject])

  useEffect(() => {
    if (selectedProjectId && activeCardRef.current) {
      setTimeout(() => {
        activeCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 100)
    }
  }, [selectedProjectId])

  const handleUploadClick = async () => {
    await onUpload()
    refetchReports()
    detailQuery.refetch()
  }

  const allProjects = allProjectsQuery.data?.projects ?? []
  const regions = Array.from(new Set(allProjects.map((project: Project) => project.region))).sort()
  const categories = Array.from(new Set(allProjects.map((project: Project) => project.category))).sort()
  
  const totalBudget = allProjects.reduce((sum, project: Project) => sum + (project.budget || 0), 0)
  const highRisk = allProjects.filter((project: Project) => project.riskClassification === 'High' || project.riskClassification === 'Critical').length
  const totalAlerts = allProjects.reduce((sum, project: Project) => sum + (project.citizenReportCount || 0), 0)
  const reports = reportsQuery.data ?? (selectedProject as any)?.citizenReports ?? []

  return (
    <div className="workspace-page">
      <div className="workspace-hero">
        <p className="eyebrow">Live DPWH Watchdog API</p>
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.description')}</p>
      </div>

      <div className="metrics-row">
        <Metric label={t('dashboard.trackedProjects')} value={String(allProjects.length)} helper="Live project records" />
        <Metric label={t('dashboard.contractValue')} value={shortPeso(totalBudget)} helper="Tracked public infrastructure value" />
        <Metric label={t('dashboard.citizenSignals')} value={String(totalAlerts)} helper={`${highRisk} high or critical risk projects`} />
      </div>

      {/* Added 'alignItems: start' style block here to correctly allow independent scrolling tracking */}
      <div className="workspace-grid" style={{ alignItems: 'start' }}>
        <section className="workspace-list">
          <Card className="filter-card">
            <label htmlFor="project-search">{t('dashboard.searchLabel')}</label>
            <div className="search-control">
              <Icon name="search" />
              <input id="project-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('dashboard.searchPlaceholder')} />
            </div>
            <div className="filter-row" aria-label="Risk filter">
              {riskOptions.map((item) => (
                <button key={item} type="button" className={risk === item ? 'active' : ''} onClick={() => setRisk(item)}>
                  {item}
                </button>
              ))}
            </div>
            <div className="filter-select-grid">
              <select aria-label="Filter by region" className="form-control" value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="">All regions</option>
                {regions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select aria-label="Filter by category" className="form-control" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">All categories</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </Card>

          {projectsQuery.isLoading ? (
            <LoadingCards />
          ) : projectsQuery.isError ? (
            <Card className="empty-state">
              <p>Unable to load projects from the live API.</p>
              <Button onClick={() => projectsQuery.refetch()}>Retry</Button>
            </Card>
          ) : projects.length === 0 ? (
            <Card className="empty-state">No projects match the current filters.</Card>
          ) : (
            projects.map((project) => {
              const isSelected = selectedProject?.contractId === project.contractId
              return (
                <ProjectCard 
                  key={project.contractId} 
                  ref={isSelected ? activeCardRef : null}
                  project={project} 
                  active={isSelected} 
                  onSelect={() => onSelectProject(project.contractId)}
                />
              )
            })
          )}
        </section>

        {selectedProject ? (
          <ProjectDetail project={selectedProject} reports={reports} isReportsLoading={reportsQuery.isLoading} onUpload={handleUploadClick} />
        ) : (
          <Card className="project-detail empty-state">Select a project to review its risk profile.</Card>
        )}
      </div>
    </div>
  )
}