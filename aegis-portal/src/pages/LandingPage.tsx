import { BRAND } from '../constants/brand'
import { useProjects } from '../hooks/useProjects'
import { shortPeso } from '../utils/formatters'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icons'
import { SectionHeader } from '../components/ui/SectionHeader'
import { StatCounter } from '../components/ui/StatCounter'
import TrafficLight from '../components/TrafficLight'

type LandingPageProps = {
  onOpenApp: () => void
  onReportIssue: () => void
}

const features = [
  ['AI Risk Detection', 'Automatically identifies project risks.', 'spark'],
  ['Citizen Monitoring', 'Public reporting and oversight.', 'shield'],
  ['Real-Time Transparency', 'Live project tracking.', 'panel'],
  ['Data-Driven Accountability', 'Risk scoring and analytics.', 'chart'],
] as const

const workflow = [
  'Government publishes project data',
  'Citizens submit field reports',
  'AI analyzes project health',
  'Risks are surfaced publicly',
] as const

export default function LandingPage({ onOpenApp, onReportIssue }: LandingPageProps) {
  const { data, isLoading } = useProjects()
  const projects = data?.projects ?? []
  const highRiskProject = projects.find((project) => project.riskClassification === 'Critical' || project.riskClassification === 'High') ?? projects[0]
  const totalReports = projects.reduce((sum, project) => sum + project.citizenReportCount, 0)
  const highRiskCount = projects.filter((project) => project.riskClassification === 'Critical' || project.riskClassification === 'High').length
  const regionCount = new Set(projects.map((project) => project.region)).size
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0)

  return (
    <main id="top">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">DPWH Watchdog API · Live Transparency Platform</p>
            <h1>AI-Powered Infrastructure Transparency</h1>
            <p>Monitor public infrastructure projects, identify risks, and empower citizen oversight.</p>
            <div className="hero-actions">
              <Button onClick={onOpenApp}>View Projects</Button>
              <Button variant="secondary" onClick={onReportIssue}>Report an Issue</Button>
            </div>
          </div>

          <div className="hero-visual" aria-label="Live infrastructure risk preview">
            <div className="dashboard-preview">
              <div className="preview-topbar">
                <img src={BRAND.logoPath} alt="" />
                <div>
                  <strong>DPWH Watchdog</strong>
                  <span>{isLoading ? 'Loading live API...' : `${projects.length} projects monitored`}</span>
                </div>
              </div>
              <div className="preview-metrics">
                <div><strong>{projects.length}</strong><span>Total Projects</span></div>
                <div><strong>{highRiskCount}</strong><span>High Risk</span></div>
                <div><strong>{totalReports}</strong><span>Citizen Reports</span></div>
              </div>
              {highRiskProject && (
                <div className="preview-project">
                  <TrafficLight risk={highRiskProject.riskClassification} />
                  <h3>{highRiskProject.projectTitle}</h3>
                  <p>{highRiskProject.province}, {highRiskProject.region}</p>
                  <div className="preview-bar"><span style={{ width: `${Math.min(highRiskProject.progress, 100)}%` }} /></div>
                  <small>{shortPeso(highRiskProject.budget)} · {highRiskProject.progress.toFixed(1)}% complete</small>
                </div>
              )}
            </div>
            <div className="floating-stat floating-stat-one">
              <strong>{regionCount}</strong>
              <span>Regions covered</span>
            </div>
            <div className="floating-stat floating-stat-two">
              <strong>{shortPeso(totalBudget)}</strong>
              <span>Tracked value</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section statistics-section">
        <SectionHeader align="center" title="Live Infrastructure Intelligence" description="Statistics are derived directly from the DPWH Watchdog API." />
        <div className="stats-grid">
          <StatCounter value={projects.length} label="Total Projects" />
          <StatCounter value={highRiskCount} label="High Risk Projects" />
          <StatCounter value={totalReports} label="Citizen Reports" />
          <StatCounter value={regionCount} label="Regions Covered" />
        </div>
      </section>

      <section className="page-section" id="features">
        <SectionHeader align="center" title="Built for Public Accountability" description="A professional government-tech workspace for monitoring, reporting, and risk review." />
        <div className="feature-grid">
          {features.map(([title, description, icon]) => (
            <Card key={title} interactive className="feature-card">
              <span className="feature-icon"><Icon name={icon} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader align="center" title="How It Works" />
        <div className="workflow workflow-four">
          {workflow.map((item, index) => (
            <div key={item} className="workflow-step">
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section about-section" id="about">
        <div>
          <SectionHeader title="Government-Tech Oversight" description="AEGIS keeps the existing public transparency mission while connecting every project, report, and score to live backend services." />
        </div>
        <Card className="mission-card">
          <img src={BRAND.logoPath} alt={BRAND.name} />
          <div>
            <strong>{BRAND.productName}</strong>
            <p>Production-ready infrastructure transparency portal</p>
          </div>
        </Card>
      </section>

      <section className="page-section cta-section" id="contact">
        <SectionHeader align="center" title="Start Monitoring Public Works" description="Review live risk scores or submit a citizen report for a project in your area." />
        <Button onClick={onOpenApp}>View Projects</Button>
      </section>
    </main>
  )
}
