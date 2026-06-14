import { BRAND } from '../constants/brand'
import { useI18n } from '../contexts/I18nContext'
import { projectService } from '../services/projectService'
import { shortPeso } from '../utils/formatters'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icons'
import { SectionHeader } from '../components/ui/SectionHeader'
import { StatCounter } from '../components/ui/StatCounter'
import TrafficLight from '../components/TrafficLight'

type LandingPageProps = {
  onOpenApp: () => void
}

const featureKeys = [
  ['monitoring', 'shield'],
  ['benchmarking', 'chart'],
  ['supplier', 'database'],
  ['geo', 'map'],
  ['aiRisk', 'spark'],
  ['transparency', 'panel'],
  ['analytics', 'report'],
  ['tracking', 'route'],
] as const

const workflowKeys = ['collect', 'verify', 'analyze', 'insights', 'reporting'] as const

export default function LandingPage({ onOpenApp }: LandingPageProps) {
  const { t } = useI18n()
  const metrics = projectService.getMetrics()
  const projects = projectService.listProjects()
  const highRiskProject = projects.find((project) => project.risk_classification === 'High') ?? projects[0]

  return (
    <main id="top">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{t('landing.eyebrow')}</p>
            <h1>{t('landing.headline')}</h1>
            <p>{t('landing.description')}</p>
            <div className="hero-actions">
              <Button onClick={onOpenApp}>{t('common.getStarted')}</Button>
              <Button variant="secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                {t('common.learnMore')}
              </Button>
            </div>
          </div>

          <div className="hero-visual" aria-label={t('landing.previewTitle')}>
            <div className="dashboard-preview">
              <div className="preview-topbar">
                <img src={BRAND.logoPath} alt="" />
                <div>
                  <strong>{t('landing.previewTitle')}</strong>
                  <span>{t('landing.previewSubtitle')}</span>
                </div>
              </div>
              <div className="preview-metrics">
                <div><strong>{metrics.totalProjects}</strong><span>{t('landing.heroStatOne')}</span></div>
                <div><strong>{metrics.riskAlerts}</strong><span>{t('landing.heroStatTwo')}</span></div>
                <div><strong>{metrics.citizenReports}</strong><span>{t('landing.heroStatThree')}</span></div>
              </div>
              <div className="preview-project">
                <TrafficLight risk={highRiskProject.risk_classification} />
                <h3>{highRiskProject.project_title}</h3>
                <p>{highRiskProject.location}</p>
                <div className="preview-bar"><span style={{ width: '72%' }} /></div>
                <small>{shortPeso(highRiskProject.contract_amount)} · {highRiskProject.physical_target}</small>
              </div>
            </div>
            <div className="floating-stat floating-stat-one">
              <strong>{metrics.verifiedEntries}</strong>
              <span>{t('stats.verified')}</span>
            </div>
            <div className="floating-stat floating-stat-two">
              <strong>{metrics.highRiskProjects}</strong>
              <span>{t('stats.alerts')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" id="features">
        <SectionHeader align="center" title={t('landing.featuresTitle')} description={t('landing.featuresDescription')} />
        <div className="feature-grid">
          {featureKeys.map(([key, icon]) => (
            <Card key={key} interactive className="feature-card">
              <span className="feature-icon"><Icon name={icon} /></span>
              <h3>{t(`features.${key}.title`)}</h3>
              <p>{t(`features.${key}.description`)}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader align="center" title={t('landing.howTitle')} description={t('landing.howDescription')} />
        <div className="workflow">
          {workflowKeys.map((key, index) => (
            <div key={key} className="workflow-step">
              <span>{index + 1}</span>
              <strong>{t(`workflow.${key}`)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section statistics-section">
        <SectionHeader align="center" title={t('landing.statsTitle')} />
        <div className="stats-grid">
          <StatCounter value={metrics.totalProjects} label={t('stats.projects')} />
          <StatCounter value={metrics.citizenReports} label={t('stats.reports')} />
          <StatCounter value={metrics.verifiedEntries} label={t('stats.verified')} />
          <StatCounter value={metrics.riskAlerts} label={t('stats.alerts')} />
        </div>
      </section>

      <section className="page-section about-section" id="about">
        <div>
          <SectionHeader title={t('landing.aboutTitle')} description={t('landing.aboutDescription')} />
        </div>
        <Card className="mission-card">
          <img src={BRAND.logoPath} alt={BRAND.name} />
          <div>
            <strong>{BRAND.productName}</strong>
            <p>{t('common.prototype')}</p>
          </div>
        </Card>
      </section>

      <section className="page-section">
        <SectionHeader align="center" title={t('landing.testimonialsTitle')} />
        <div className="testimonial-grid">
          <Card className="testimonial-card">
            <p>“{t('testimonials.oneQuote')}”</p>
            <strong>{t('testimonials.oneName')}</strong>
            <span>{t('testimonials.oneRole')}</span>
          </Card>
          <Card className="testimonial-card">
            <p>“{t('testimonials.twoQuote')}”</p>
            <strong>{t('testimonials.twoName')}</strong>
            <span>{t('testimonials.twoRole')}</span>
          </Card>
        </div>
      </section>

      <section className="page-section cta-section">
        <SectionHeader align="center" title={t('landing.contactTitle')} description={t('landing.contactDescription')} />
        <Button onClick={onOpenApp}>{t('common.getStarted')}</Button>
      </section>
    </main>
  )
}
